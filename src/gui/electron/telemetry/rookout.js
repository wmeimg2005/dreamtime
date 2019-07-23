const rookout = require('rookout')
const isRenderer = require('is-electron-renderer')
const debug = require('debug').default('app:electron:telemetry:rookout')

const { settings } = require('../modules')

const instance = {
  init() {
    if (!this.can()) {
      return
    }

    const config = {
      token: process.env.ROOKOUT_TOKEN
    }

    rookout.start(config)

    debug('Rookout initialized!', config)
  },

  can() {
    return process.env.ROOKOUT_TOKEN && !isRenderer
  }
}

instance.init()

module.exports = new Proxy(instance, {
  get(obj, prop) {
    if (prop in obj) {
      return obj[prop]
    }

    if (prop in rookout) {
      if (obj.can()) {
        return rookout[prop]
      }

      return () => {}
    }

    return undefined
  }
})
