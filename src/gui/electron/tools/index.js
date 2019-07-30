const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')
const EventBus = require('js-event-bus')
const gpuInfo = require('gpu-info')
const { getRootPath, api } = require('electron-utils')
const debug = require('debug').default('app:electron:tools')
// const Caman = require('caman').Caman

const settings = require('../modules/settings')
const AppError = require('../modules/error')
const config = require('../../nuxt.config')

/**
 * deepTools.
 * Offers a communication channel between the GUI and NodeJS to interact with operating system tools
 */
module.exports = {
  /**
   * Returns an absolute path depending on the parameters
   *
   * @param {string} name Name of the base path: https://electronjs.org/docs/all#appgetpathname
   * @param {string} args Series of path segments to join into one path
   */
  getPath(name, ...args) {
    let folderPath

    if (name === 'root') {
      const rootPath = getRootPath()
      folderPath = path.resolve(rootPath, '../')

      // The name "root" is reserved for the location
      // where the gui and cli folders are located
      /* if (config.dev) {
        folderPath = path.resolve(rootPath, '../')
      } else {
        folderPath = path.resolve(rootPath, '../../../')
      } */
    } else {
      folderPath = api.app.getPath(name)
    }

    return path.join(folderPath, ...args)
  },

  /**
   * Alias for getPath('root', ...args)
   *
   * @param  {string} args Series of path segments to join into one path
   */
  getRootPath(...args) {
    return this.getPath('root', ...args)
  },

  /**
   * Returns a list with information of the graphic cards installed in the computer.
   */
  getGpusList() {
    return gpuInfo()
  },

  /**
   *
   */
  getCliDirPath() {
    return this.getRootPath('cli')
  },

  testError() {
    window.$rollbar.error(Error('tools error!'))
  },

  /**
   *
   * @param {*} job
   */
  transform(job) {
    const cliDirPath = settings.folders.cli
    const preferences = job.getPhoto().getPreferences()

    const inputFilePath = job
      .getPhoto()
      .getCroppedFile()
      .getPath()

    const outputFilePath = job.getFile().getPath()

    if (!fs.existsSync(cliDirPath)) {
      throw new AppError(
        `The CLI folder could not be found!\n
        This can be caused by a corrupt installation, make sure that the folder exists in:\n
        ${cliDirPath}`
      )
    }

    if (!fs.existsSync(inputFilePath)) {
      throw new AppError(
        `The cropped photo was not found!\n
        This may be caused because the program does not have permissions to write to the directory or has been automatically deleted, please make sure that the following file exists:\n
        ${inputFilePath}`
      )
    }

    const cliArgs = ['--input', inputFilePath, '--output', outputFilePath]

    // TODO: Preferences
    if (preferences.pubicHairSize !== 0) {
      cliArgs.push('--enablepubes')
    }

    if (settings.processing.usePython) {
      // Use the script in Python instead of the executable
      cliArgs.unshift('main.py')
    }

    if (settings.processing.device === 'CPU') {
      // CPU slow Processing
      cliArgs.push('--cpu')
    } else {
      for (const id of settings.processing.gpus) {
        cliArgs.push(`--gpu`)
        cliArgs.push(id)
      }
    }

    debug('The transformation process has begun!', {
      cliDirPath,
      inputFilePath,
      outputFilePath,
      cliArgs,
      job
    })

    const bus = new EventBus()

    let child

    if (settings.processing.usePython) {
      child = spawn('python', cliArgs, {
        cwd: cliDirPath
      })
    } else {
      child = spawn(path.join(cliDirPath, 'cli'), cliArgs)
    }

    child.on('error', error => {
      debug(error)
      bus.emit('error', null, error)
    })

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

  /**
   *
   */
  fs: require('./fs'),

  /**
   *
   */
  shell: require('./shell')
}
