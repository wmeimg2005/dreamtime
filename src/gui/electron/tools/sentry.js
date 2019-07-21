const Sentry = require('@sentry/electron')
const debug = require('debug').default('app:electron:tools:sentry')
const settings = require('./settings')

const sentry = {
  init() {
    if (!this.can()) {
      return
    }

    // Send any error to Sentry
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      release: process.env.npm_package_version,
      environment: process.env.NODE_ENV
    })

    debug('Sentry initialized!', {
      dsn: process.env.SENTRY_DSN,
      release: process.env.npm_package_version,
      environment: process.env.NODE_ENV
    })
  },

  can() {
    return settings.telemetry.enabled && process.env.SENTRY_DSN
  }
}

module.exports = new Proxy(sentry, {
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
