const { Rollbar } = require('electron-utils')
const debug = require('debug').default('app:electron:modules:rollbar')

const settings = require('./settings')
const nucleus = require('./nucleus')

const instance = {
  init() {
    if (!this.can()) {
      return
    }

    const config = {
      accessToken: this.getAccessToken(),
      captureUncaught: true,
      captureUnhandledRejections: true,
      captureIp: 'anonymize',
      verbose: true,
      nodeSourceMaps: true,
      payload: {
        environment: process.env.NODE_ENV,
        person: {
          id: settings.user
        },
        client: {
          javascript: {
            source_map_enabled: true,
            code_version: process.env.npm_package_version,
            guess_uncaught_frames: true
          }
        }
      }
    }

    this._rollbar = new Rollbar(config)

    debug('Rollbar initialized!', config)
  },

  getAccessToken() {
    return process.env.ROLLBAR_ACCESS_TOKEN || nucleus.keys.rollbar_access_token
  },

  can() {
    return settings.telemetry.enabled && this.getAccessToken()
  }
}

module.exports = new Proxy(instance, {
  get(obj, prop) {
    if (prop in obj) {
      return obj[prop]
    }

    if (prop in obj._rollbar) {
      if (obj.can()) {
        return obj._rollbar[prop]
      }

      return () => {}
    }

    return undefined
  }
})
