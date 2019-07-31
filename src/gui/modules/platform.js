import _ from 'lodash'
import path from 'path'
import filesize from 'filesize'

const debug = require('debug').default('app:modules:platform')

/**
 *
 */
export default {
  /**
   *
   */
  async init() {
    this.gpuDevices = []

    this.requirements = {
      cli: false,
      checkpoints: false,
      windowsMedia: false
    }

    await this._fetchGpuDevices()

    this._checkCli()
    this._checkCheckpoints()
    await this._checkWindowsMedia()

    debug('Platform initialized!', {
      gpuDevices: this.gpuDevices,
      requirements: this.requirements
    })
  },

  /**
   *
   */
  async _fetchGpuDevices() {
    try {
      const devices = await $tools.getGpusList()

      $rollbar.log('GPU Devices', {
        custom: {
          devices
        }
      })

      this.gpuDevices = _.filter(devices, { AdapterCompatibility: 'NVIDIA' })
    } catch (error) {
      console.warn(error)
      this.gpuDevices = []
    }
  },

  /**
   *
   */
  getGpuDevices() {
    return this.gpuDevices
  },

  /**
   * Verify if the CLI directory is valid
   */
  _checkCli() {
    this.requirements.cli = false

    const dirPath = $settings.folders.cli

    if (!_.isString(dirPath)) {
      // And in some extraordinary way,
      // the user managed to change the setting to something invalid :Pepega:
      return
    }

    if (!$tools.fs.exists(dirPath)) {
      return
    }

    // One of these files must exist
    const binaries = ['main.py', 'dreampower.exe', 'cli.exe']

    for (const bin of binaries) {
      if ($tools.fs.exists(path.join(dirPath, bin))) {
        this.requirements.cli = true
        break
      }
    }
  },

  /**
   * Check if the checkpoints directory is valid
   * You better be valid.....
   *
   * User: Where I download the checkpoints?
   * Developer: Are you kidding me? Fucking fuck! What the fucking shit? God damnit.
   */
  _checkCheckpoints() {
    this.requirements.checkpoints = false

    const dirPath = path.join($settings.folders.cli, 'checkpoints')

    if (!$tools.fs.exists(dirPath)) {
      // I guess it's the first time execution...
      return
    }

    // All these files must exist
    const models = ['cm.lib', 'mm.lib', 'mn.lib']

    for (const modelFile of models) {
      const modelPath = path.join(dirPath, modelFile)

      if (!$tools.fs.exists(modelPath)) {
        // dude... wtf
        return
      }

      const stats = $tools.fs.statSync(modelPath)
      const size = filesize(stats.size, { exponent: 2, output: 'object' })

      if (size.value < 690) {
        // almost... you almost had it
        return
      }
    }

    // Con-fucking-grats!
    this.requirements.checkpoints = true
  },

  /**
   *
   */
  async _checkWindowsMedia() {
    if (!$tools.utils.is.windows) {
      // Not running in Windows ¯\_(ツ)_/¯
      this.requirements.windowsMedia = true
      return
    }

    this.requirements.windowsMedia = await $tools.shell.hasWindowsMedia()
  }
}
