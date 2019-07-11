require('dotenv').config()

const { remote } = require('electron')
const fs = require('fs')
const path = require('path')
const mime = require('mime-types')
const { spawn } = require('child_process')
const EventBus = require('js-event-bus')
const _ = require('lodash')
const gpuInfo = require('gpu-info')
const config = require('./nuxt.config')

const debug = require('debug').default('app:preload')

const { app, shell } = remote

function getBase64Data(dataURL) {
  let encoded = dataURL.replace(/^data:(.*;base64,)?/, '')

  if (encoded.length % 4 > 0) {
    encoded += '='.repeat(4 - (encoded.length % 4))
  }

  return encoded
}

window.deepTools = {
  /**
   *
   * @param {*} name
   * @param  {...any} args
   */
  getPath(name, ...args) {
    let folderPath

    if (name === 'base') {
      if (config.dev) {
        folderPath = path.dirname(__dirname)
      } else {
        folderPath = path.dirname(path.dirname(app.getPath('exe')))
      }
    } else {
      folderPath = app.getPath(name)
    }

    return path.join(folderPath, ...args)
  },

  /**
   *
   * @param {*} name
   * @param  {...any} args
   */
  getBasePath(...args) {
    return this.getPath('base', ...args)
  },

  /**
   *
   */
  getGpusList() {
    return gpuInfo()
  },

  /**
   *
   * @param {*} dirPath
   */
  shellOpenItem(dirPath) {
    return shell.openItem(dirPath)
  },

  /**
   *
   * @param {*} path
   */
  shellOpenExternal(path) {
    return shell.openExternal(path)
  },

  /**
   *
   * @param {*} filePath
   */
  getValidationErrorMessage(filePath) {
    if (!fs.existsSync(filePath)) {
      return 'Apparently the file does not exist anymore!'
    }

    const mimetype = mime.lookup(filePath)
    const stats = fs.statSync(filePath)
    const filesize = stats.size / 1000000.0

    if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
      return 'The selected file is not a valid photo. Only JPEG or PNG.'
    }

    if (filesize > 5) {
      return 'The selected file is big, this can generate problems. Maximum size: 5MB'
    }

    return null
  },

  /**
   *
   * @param {*} filepath
   */
  getFileAsDataURL(filepath) {
    const mimetype = mime.lookup(filepath)
    const data = fs.readFileSync(filepath, { encoding: 'base64' })

    return `data:${mimetype};base64,${data}`
  },

  /**
   *
   * @param {*} dataURL
   * @param {*} absolutePath
   */
  saveDataURLFile(dataURL, absolutePath) {
    const data = getBase64Data(dataURL)
    return fs.writeFileSync(absolutePath, data, 'base64')
  },

  /**
   *
   * @param {*} modelPhoto
   * @param {*} useGpus
   * @param {*} useWaifu TODO
   */
  transform(modelPhoto, useGpus = false, useWaifu = false) {
    if (!useGpus) {
      useWaifu = false
    }

    const cliDirPath = this.getBasePath('cli')
    const inputFilePath = modelPhoto.getCroppedFilePath()
    const outputFilePath = modelPhoto.getOutputFilePath()

    if (!fs.existsSync(cliDirPath)) {
      throw new Error(
        `A problem has occurred, we could not find the CLI folder!\n
        This can be caused by a corrupt installation, make sure that the CLI folder exists in:\n\n
        ${cliDirPath}`
      )
    }

    if (!fs.existsSync(inputFilePath)) {
      throw new Error(
        `A problem has occurred, we could not find the cropped photo!\n
        This may mean that ${process.env.APP_NAME} does not have permissions to write in the models folder, please make sure that the following folder exists:\n\n
        ${inputFilePath}`
      )
    }

    const cliArgs = ['--input', inputFilePath, '--output', outputFilePath]

    if (config.dev) {
      cliArgs.unshift('main.py')
    }

    if (!useGpus) {
      cliArgs.push('--cpu')
    } else {
      for (const id of useGpus) {
        cliArgs.push(`--gpu`)
        cliArgs.push(id)
      }
    }

    debug('The transformation process has begun!', {
      cliDirPath,
      inputFilePath,
      outputFilePath,
      cliArgs
    })

    const bus = new EventBus()

    let child

    try {
      if (config.dev) {
        child = spawn('python', cliArgs, {
          cwd: cliDirPath
        })
      } else {
        child = spawn('cli.exe', cliArgs, {
          cwd: cliDirPath
        })
      }
    } catch (error) {
      throw new Error(
        `A problem has occurred, we were unable to start the CLI for the transformation!\n
        This can be caused by a corrupt installation, please make sure that cli.exe exists and works correctly (if you are a developer, make sure that main.py works)\n\n
        The script has reported the following error, take a screenshot to get more information:\n\n
        ${error}`
      )
    }

    child.stdout.on('data', data => {
      debug(`stdout: ${data}`)
      bus.emit('stdout', null, data)
    })

    child.stderr.on('data', data => {
      debug(`stderr: ${data}`)
      bus.emit('stderr', null, data)
    })

    child.on('close', code => {
      debug(`CLI process exited with code ${code}`)
      bus.emit('ready', null, code)
    })

    return bus
  },

  process(gpuId, useCpu) {
    if (useCpu === true) {
      gpuId = null
    }

    const cliPath = path.join(
      path.dirname(path.dirname(app.getPath('exe'))),
      'cli'
    )

    const inputPath = path.join(path.dirname(app.getPath('temp')), 'input.png')

    const outputPath = path.join(
      path.dirname(app.getPath('temp')),
      'output.png'
    )

    const args = [`--input`, inputPath, `--output`, outputPath]

    if (config.dev) {
      args.unshift('main.py')
    }

    if (useCpu) {
      args.push('--cpu')
    }

    if (!_.isNil(gpuId)) {
      args.push(`--gpu`)
      args.push(gpuId)
    }

    const eventBus = new EventBus()
    let child

    if (config.dev) {
      child = spawn('python', args, {
        cwd: cliPath
      })
    } else {
      child = spawn('cli.exe', args, {
        cwd: cliPath
      })
    }

    child.stdout.on('data', data => {
      console.log(`stdout: ${data}`)
      eventBus.emit('stdout', null, data)
    })

    child.stderr.on('data', data => {
      console.log(`stderr: ${data}`)
      eventBus.emit('stderr', null, data)
    })

    child.on('close', code => {
      console.log(`child process exited with code ${code}`)
      eventBus.emit('ready', null, code)
    })

    return eventBus
  }
}
