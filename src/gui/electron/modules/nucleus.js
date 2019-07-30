const Nucleus = require('electron-nucleus')
const debug = require('debug').default('app:electron:modules:nucleus')

const settings = require('./settings')

/**
 * https://nucleus.sh
 * Service that provides us with analytical information and global application settings
 */
const nucleus = {
  _nucleus: undefined,

  _settings: {},

  /**
   * Initialize the service, this is called automatically
   */
  init() {
    return new Promise((resolve, reject) => {
      if (!this.can()) {
        // Can't start the service
        resolve()
        return
      }

      // Nucleus Configuration
      const config = {
        disableTracking: settings.telemetry.enabled === false,
        disableErrorReports: true,
        userId: settings.user,
        version: process.env.npm_package_version
      }

      // Create the Nucleus instance
      this._nucleus = Nucleus(this.getAppId(), config)

      // Get global application settings
      this._nucleus.getCustomData((error, payload) => {
        this._settings = payload

        debug('Nucleus initialized!', config)
        resolve()
      })
    })
  },

  /**
   * Returns the APP ID to use the service
   */
  getAppId() {
    return process.env.NUCLEUS_APPID
  },

  /**
   * Returns if the service can be used
   */
  can() {
    return this.getAppId()
  }
}

module.exports = new Proxy(nucleus, {
  get(obj, prop) {
    if (prop in obj) {
      return obj[prop]
    }

    if (prop in obj._settings) {
      return obj._settings[prop]
    }

    if (obj._nucleus && prop in obj._nucleus) {
      if (obj.can()) {
        return obj._nucleus[prop]
      }

      return () => {}
    }

    return undefined
  }
})
