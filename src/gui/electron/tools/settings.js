const fs = require('fs')
const tools = require('./tools')

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
    this.load()
  },

  /**
   * Load the settings file. If it is already loaded then it refreshes.
   */
  async load() {
    this._data = JSON.parse(fs.readFileSync(this._path))
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

//
settings.init()

module.exports = new Proxy(settings, {
  get: (obj, prop) => {
    if (prop in obj._data) {
      return obj._data[prop]
    }

    if (prop in obj) {
      return obj[prop]
    }

    return undefined
  },

  set: (obj, prop, value) => {
    if (prop in obj._data) {
      obj._data[prop] = value
      obj.save()

      return true
    }

    obj[prop] = value
    return true
  }
})
