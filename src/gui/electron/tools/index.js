const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')
const EventBus = require('js-event-bus')
const gpuInfo = require('gpu-info')
const utils = require('electron-utils')

const debug = require('debug').default('app:electron:tools')
// const Caman = require('caman').Caman

const AppError = require('../modules/error')
const paths = require('./paths')
const config = require('../../nuxt.config')

/**
 * deepTools.
 * Offers a communication channel between the GUI and NodeJS to interact with operating system tools
 */
module.exports = {
  /**
   *
   */
  testError() {
    $rollbar.error(Error('tools error!'))
  },

  /**
   * Returns a list with information of the graphic cards installed in the computer.
   */
  getGpusList() {
    return gpuInfo()
  },

  /**
   *
   * @param {*} job
   */
  transform(job) {
    // Independent preferences for the photo
    const preferences = job.getPhoto().getPreferences()

    // Cropped photo
    const inputFilePath = job
      .getPhoto()
      .getCroppedFile()
      .getPath()

    // Final photo
    const outputFilePath = job.getFile().getPath()

    if (!fs.existsSync(inputFilePath)) {
      throw new AppError(
        `The cropped photo was not found!\n
        This may be caused because the program does not have permissions to write to the directory or has been automatically deleted, please make sure that the following file exists:\n
        ${inputFilePath}`
      )
    }

    const cliArgs = ['--input', inputFilePath, '--output', outputFilePath]

    cliArgs.push('--bsize')
    cliArgs.push(preferences.boobsSize)

    cliArgs.push('--asize')
    cliArgs.push(preferences.areolaSize)

    cliArgs.push('--nsize')
    cliArgs.push(preferences.nippleSize)

    cliArgs.push('--vsize')
    cliArgs.push(preferences.vaginaSize)

    cliArgs.push('--hsize')
    cliArgs.push(preferences.pubicHairSize)

    if ($settings.processing.usePython) {
      // Use the Python script instead of the executable
      cliArgs.unshift('main.py')
    }

    if ($settings.processing.device === 'CPU') {
      cliArgs.push('--cpu')
    } else {
      for (const id of $settings.processing.gpus) {
        cliArgs.push(`--gpu`)
        cliArgs.push(id)
      }
    }

    debug('The transformation process has begun!', {
      inputFilePath,
      outputFilePath,
      cliArgs,
      job
    })

    let process
    const bus = new EventBus()

    if ($settings.processing.usePython) {
      // Use the Python script instead of the executable
      process = spawn('python', cliArgs, {
        cwd: paths.getCli()
      })
    } else {
      process = spawn(paths.getCli('dreampower'), cliArgs)
    }

    process.on('error', error => {
      debug(error)
      bus.emit('error', null, error)
    })

    process.stdout.on('data', data => {
      debug(`stdout: ${data}`)
      bus.emit('stdout', null, data)
    })

    process.stderr.on('data', data => {
      debug(`stderr: ${data}`)
      bus.emit('stderr', null, data)
    })

    process.on('close', code => {
      debug(`CLI process exited with code ${code}`)
      bus.emit('ready', null, code)
    })

    return bus
  },

  //
  fs: require('./fs'),

  //
  shell: require('./shell'),

  //
  paths,

  /**
   *
   */
  utils
}
