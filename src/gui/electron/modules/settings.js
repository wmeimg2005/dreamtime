const fs = require('fs')
const _ = require('lodash')
const { uuid } = require('electron-utils')
const debug = require('debug').default('app:electron:modules:settings')

const tools = require('../tools')

/**
 * User settings.
 * This class is responsible for loading, saving and offering easy access to user settings.
 *
 * Examples:
 * settings.processing.device -> 'CPU'
 *
 * settings.telemetry.enabled = false
 * settings.save()
 */
const settings = {
  /**
   * Initialize the settings
   */
  init() {
    this._path = tools.getRootPath('gui', 'settings.json')
    this._settings = {}

    this.ensure()
    this.load()
  },

  /**
   * Returns the value of the settings in the path
   *
   * @param {string} path
   */
  get(path = '') {
    if (path.length === 0) {
      return this._settings
    }

    return _.get(this._settings, path)
  },

  /**
   * Set a new value in the settings
   *
   * @param {any} path
   * @param {any} payload
   */
  set(path, payload) {
    if (_.isPlainObject(path)) {
      this._settings = path
      this.save()
    }

    this._settings = _.set(this._settings, path, payload)
    this.save()
  },

  /**
   * Make sure the settings file exists
   */
  ensure() {
    if (fs.existsSync(this._path)) {
      // Exists
      return
    }

    const defaultSettings = {
      user: uuid(),

      processing: {
        device: 'GPU',
        gpus: [0],
        useWaifu: false, // weebs out 😡👉🚪
        useRestoration: true,
        usePython: process.env.NODE_ENV === 'dev'
      },

      preferences: {
        executions: 1,
        enablePubes: true,
        boobsSize: 'medium',
        pubicHairSize: 'medium',
        useCustomMask: false
      },

      folders: {
        cropped: tools.getPath('temp'),
        models: tools.getPath('userData', 'models'),
        masks: tools.getPath('userData', 'masks'),
        cli: tools.getRootPath('cli')
      },

      telemetry: {
        enabled: true
      }
    }

    fs.writeFileSync(this._path, JSON.stringify(defaultSettings, null, 2))
  },

  /**
   * Load the settings file. If it is already loaded then it refreshes.
   */
  async load() {
    this._settings = JSON.parse(fs.readFileSync(this._path))
    debug('User Settings loaded!', this._settings)
  },

  /**
   * Save the settings.
   * This function is called automatically if you set a first level variable.
   */
  async save() {
    const payload = JSON.stringify(this._settings, null, 2)
    fs.writeFileSync(this._path, payload)
  }
}

module.exports = new Proxy(settings, {
  get: (obj, prop) => {
    if (prop in obj) {
      return obj[prop]
    }

    if (prop in obj._settings) {
      return obj._settings[prop]
    }

    return undefined
  },

  set: (obj, prop, value) => {
    if (!_.isNil(obj._settings)) {
      if (prop in obj._settings) {
        obj._settings[prop] = value
        obj.save()

        return true
      }
    }

    obj[prop] = value
    return true
  }
})
