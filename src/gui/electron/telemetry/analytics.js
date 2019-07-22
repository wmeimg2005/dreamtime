const ua = require('universal-analytics')
const uuid = require('uuid/v4')
const debug = require('debug').default('app:electron:tools:sentry')
const settings = require('./settings')

const instance = {
  init() {
    if (!this.can()) {
      return
    }

    const userId = settings.user || uuid()
    this._visitor = ua(process.env.GOOGLE_ANALYTICS_ID, userId)

    debug('Analytics initialized!', {
      userId
    })
  },

  can() {
    return settings.telemetry.enabled && process.env.GOOGLE_ANALYTICS_ID
  }
}

module.exports = new Proxy(instance, {
  get(obj, prop) {
    if (prop in obj) {
      return obj[prop]
    }

    if (prop in obj._visitor) {
      if (obj.can()) {
        return obj._visitor[prop]
      }

      return () => {}
    }

    return undefined
  }
})
