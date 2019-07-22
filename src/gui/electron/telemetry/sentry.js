const Sentry = require('@sentry/electron')
const debug = require('debug').default('app:electron:telemetry:sentry')

const { settings } = require('../modules')

const instance = {
  init() {
    if (!this.can()) {
      return
    }

    const config = {
      dsn: process.env.SENTRY_DSN,
      release: process.env.npm_package_version,
      environment: process.env.NODE_ENV
    }

    // Send any error to Sentry
    Sentry.init(config)

    debug('Sentry initialized!', config)
  },

  can() {
    return settings.telemetry.enabled && process.env.SENTRY_DSN
  }
}

instance.init()

module.exports = new Proxy(instance, {
  get(obj, prop) {
    if (prop in obj) {
      return obj[prop]
    }

    if (prop in Sentry) {
      if (obj.can()) {
        return Sentry[prop]
      }

      return () => {}
    }

    return undefined
  }
})
