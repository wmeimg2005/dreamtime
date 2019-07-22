const fs = require('fs')
const _ = require('lodash')
const uuid = require('uuid/v4')
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
   * Set the location of the settings file and load it
   */
  init() {
    this._path = tools.getRootPath('gui', 'settings.json')
    this._data = {}

    this.ensure()
    this.load()
  },

  /**
   *
   */
  get() {
    return this._data
  },

  /**
   *
   * @param {*} settings
   */
  set(settings) {
    this._data = settings
    this.save()
  },

  /**
   *
   */
  ensure() {
    if (fs.existsSync(this._path)) {
      return
    }

    const defaultSettings = {
      user: uuid(),

      processing: {
        device: 'GPU',
        gpus: [0],
        useWaifu: false, // weebs out 😡👉🚪
        useRestoration: true
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
        masks: tools.getPath('userData', 'masks')
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
    this._data = JSON.parse(fs.readFileSync(this._path))

    debug('User Settings loaded!', this._data)
  },

  /**
   * Save the settings.
   * This function is called automatically if you set a first level variable.
   */
  async save() {
    const data = JSON.stringify(this._data, null, 2)
    fs.writeFileSync(this._path, data)
  }
}

settings.init()

module.exports = new Proxy(settings, {
  get: (obj, prop) => {
    if (prop in obj) {
      return obj[prop]
    }

    if (prop in obj._data) {
      return obj._data[prop]
    }

    return undefined
  },

  set: (obj, prop, value) => {
    if (!_.isNil(obj._data)) {
      if (prop in obj._data) {
        obj._data[prop] = value
        obj.save()

        return true
      }
    }

    obj[prop] = value
    return true
  }
})
