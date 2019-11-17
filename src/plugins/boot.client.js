import Vue from 'vue'
import moment from 'moment'
import tippy from 'tippy.js'
import BaseMixin from '~/mixins/BaseMixin'
import {
  dream, platform, updater, nudify, WebError,
} from '~/modules'

const debug = require('debug').default('app:plugins:boot')

if (process.env.NODE_ENV === 'dev') {
  // Development stuff
  localStorage.debug = 'app:*'
}

// Lift off!
debug('Preparing front-end...')

// Base Mixin
Vue.mixin(BaseMixin)

// MomentJS
moment.locale('en')

// Tippy settings
tippy.setDefaultProps({
  delay: 100,
  arrow: true,
})

export default async ({ app }, inject) => {
  // Environment Information
  debug('Enviroment', {
    app,
    env: process.env.NODE_ENV,
    isStatic: $tools.utils.pack.isStatic(),
    paths: {
      appPath: $tools.utils.api.app.getAppPath(),
      exePath: $tools.utils.api.app.getPath('exe'),
    },
  })

  inject('tools', $tools)

  //---

  // User settings
  await $settings.init()
  inject('settings', $settings)

  // Analytics
  // App settings
  await $nucleus.init()
  inject('nucleus', $nucleus)

  // Error reporting
  $rollbar.init()

  //---

  window.addEventListener('error', (error) => {
    debug('Error captured', {
      error,
      type: typeof error,
    })

    WebError.handle(error)
    return true
  })

  window.addEventListener('unhandledrejection', (rejection) => {
    debug('Unhandled Rejection captured', {
      error: rejection.reason,
      type: typeof rejection.reason,
    })

    WebError.handle(rejection.reason)
    return true
  })

  Vue.config.errorHandler = (err) => {
    WebError.handle(err)
    throw err
  }

  //---

  // DreamTime information
  dream.init()
  window.$dream = dream
  app.context.$dream = dream
  inject('dream', dream)

  // Platform information
  await platform.init()
  app.context.$platform = platform
  inject('platform', platform)

  // Updates information
  updater.init()
  app.context.$updater = updater
  inject('updater', updater)

  //---

  // Nudify process
  nudify.init()
  app.context.$nudify = nudify
  inject('nudify', nudify)

  // axios - default headers
  // $axios.setHeader('X-Requested-With', 'XMLHttpRequest')

  // Debug
  debug('The front-end is ready to render!', { app })
}
