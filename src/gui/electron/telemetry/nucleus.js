const Nucleus = require('electron-nucleus')
const debug = require('debug').default('app:electron:telemetry:nucleus')

const { settings } = require('../modules')

const instance = {
  init() {
    if (!this.can()) {
      return
    }

    const config = {
      disableErrorReports: true,
      userId: settings.user,
      version: process.env.npm_package_version
    }

    this._nucleus = Nucleus(process.env.NUCLEUS_APP_ID, config)

    debug('Nucleus initialized!', config)
  },

  can() {
    return settings.telemetry.enabled && process.env.NUCLEUS_APP_ID
  }
}

instance.init()

module.exports = new Proxy(instance, {
  get(obj, prop) {
    if (prop in obj) {
      return obj[prop]
    }

    if (prop in instance._nucleus) {
      if (obj.can()) {
        return instance._nucleus[prop]
      }

      return () => {}
    }

    return undefined
  }
})
