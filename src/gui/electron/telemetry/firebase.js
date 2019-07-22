const firebase = require('firebase/app')
require('firebase/performance')
const debug = require('debug').default('app:electron:telemetry:firebase')

const { settings } = require('../modules')

const instance = {
  init() {
    if (!this.can()) {
      return
    }

    const config = {
      apiKey: process.env.FIREBASE_KEY,
      authDomain: `${process.env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
      messagingSenderId: process.env.FIREBASE_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID
    }

    firebase.initializeApp(config)
    this._perf = firebase.performance()

    debug('Firebase initialized!', config)
  },

  can() {
    return settings.telemetry.enabled && process.env.FIREBASE_KEY
  }
}

instance.init()

module.exports = new Proxy(instance, {
  get(obj, prop) {
    if (prop in obj) {
      return obj[prop]
    }

    if (prop in instance._perf) {
      if (obj.can()) {
        return instance._perf[prop]
      }

      return () => {}
    }

    return undefined
  }
})
