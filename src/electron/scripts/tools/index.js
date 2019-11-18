const _ = require('lodash')
const fs = require('fs')
const { spawn } = require('child_process')
const EventBus = require('js-event-bus')
const gpuInfo = require('gpu-info')
const utils = require('electron-utils')
const deferred = require('deferred')
const semverRegex = require('semver-regex')

const debug = require('debug').default('app:electron:tools')
const { Image } = require('image-js')
// const { Caman } = require('caman')

const paths = require('./paths')
const { system } = require('./system')

/**
 * deepTools.
 * Offers a communication channel between the GUI and NodeJS to interact with operating system tools
 */
module.exports = {
  /**
   *
   */
  testError() {
    Error('tools error!')
  },

  /**
   * Returns a list with information of the graphic cards installed in the computer.
   */
  async getGpusList() {
    const devices = await gpuInfo()
    return _.filter(devices, { AdapterCompatibility: 'NVIDIA' })
  },

  /**
   * This is probably not a good cropper, but it's all I have now...
   *
   * @param {Photo} photo
   * @param {HTMLCanvasElement} canvas
   */
  async crop(photo, canvas) {
    const image = Image.fromCanvas(canvas)
    const savePath = photo.getCroppedFile().getPath()

    debug(`Saving cropped photo in ${savePath}`)
    await image.save(savePath)

    if (!fs.existsSync(savePath)) {
      console.warn(
        'It seems that the first crop method has failed, trying the legacy method',
      )

      await this.legacyCrop(photo, canvas)
    } else {
      photo.getCroppedFile().reload()
    }
  },

  /**
   *
   * @param {*} photo
   * @param {*} canvas
   */
  async legacyCrop(photo, canvas) {
    const canvasAsDataURL = canvas.toDataURL(
      photo.getSourceFile().getMimetype(),
      1,
    )

    await photo.getCroppedFile().writeDataURL(canvasAsDataURL)

    if (!fs.existsSync(photo.getCroppedFile().getPath())) {
      throw new Error(
        'There was a problem trying to save the cropped photo. Please make sure the program has write permissions.',
      )
    }
  },

  /**
   *
   * @param {*} job
   */
  transform(job) {
    // Independent preferences for the photo
    const { preferences } = job

    // input
    const photoFilepath = job.photo.file.getPath()

    // output
    const outputFilepath = job.file.getPath()

    // CLI Args
    const args = ['run', '--input', photoFilepath, '--output', outputFilepath]

    if ($settings.processing.usePython) {
      // use python script
      args.unshift('main.py')
    }

    // Device preferences
    if ($settings.processing.device === 'CPU') {
      args.push('--cpu', '--n-cores', $settings.processing.cores)
    } else {
      for (const id of $settings.processing.gpus) {
        args.push('--gpu', id)
      }
    }

    // Advanced preferences
    const { scaleMode, useColorTransfer } = preferences.advanced

    if (scaleMode === 'cropjs') {
      const { crop } = job.photo
      args.push('--overlay', `${crop.startX},${crop.startY}:${crop.endX},${crop.endY}`)
    } else if (scaleMode !== 'none') {
      args.push(`--${scaleMode}`)
    }

    if (useColorTransfer) {
      args.push('--color-transfer')
    }

    // Body preferences
    args.push('--bsize', preferences.body.boobs.size)
    args.push('--asize', preferences.body.areola.size)
    args.push('--nsize', preferences.body.nipple.size)
    args.push('--vsize', preferences.body.vagina.size)
    args.push('--hsize', preferences.body.pubicHair.size)

    debug('The transformation process has begun!', {
      input: photoFilepath,
      output: outputFilepath,
      preferences,
      args,
      job,
    })

    let process
    const bus = new EventBus()

    if ($settings.processing.usePython) {
      // python script
      process = spawn('python3', args, {
        cwd: paths.getCli(),
      })
    } else {
      process = spawn(paths.getCli('dreampower'), args, {
        cwd: paths.getCli(),
      })
    }

    process.on('error', (error) => {
      console.error(error)
      bus.emit('error', null, error)
    })

    process.stdout.on('data', (data) => {
      console.info(`stdout: ${data}`)
      bus.emit('stdout', null, data)
    })

    process.stderr.on('data', (data) => {
      console.warn(`stderr: ${data}`)
      bus.emit('stderr', null, data)
    })

    process.on('close', (code) => {
      console.log(`CLI process exited with code ${code}`)
      bus.emit('ready', null, code)
    })

    bus.on('kill', () => {
      process.stdin.pause()
      process.kill()
    })

    return bus
  },

  getPowerVersion() {
    const def = deferred()

    let process
    let response = ''

    if ($settings.processing.usePython) {
      // python script
      process = spawn('python3', ['main.py', '--version'], {
        cwd: paths.getCli(),
      })
    } else {
      process = spawn(paths.getCli('dreampower'), ['--version'])
    }

    process.on('error', () => {
      def.resolve('')
    })

    process.stdout.on('data', (data) => {
      response += data
    })

    process.on('close', () => {
      response = semverRegex().exec(response)
      response = `v${response[0]}`

      def.resolve(response)
    })

    return def.promise
  },

  //
  // eslint-disable-next-line global-require
  fs: require('./fs'),

  //
  // eslint-disable-next-line global-require
  shell: require('./shell'),

  //
  paths,

  /**
   *
   */
  utils,

  /**
   *
   */
  system,
}
