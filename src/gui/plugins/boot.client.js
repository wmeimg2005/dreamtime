import Vue from 'vue'
import moment from 'moment'
import tippy from 'tippy.js'
import BaseMixin from '~/mixins/BaseMixin'
import { dream, platform, updater, nudify } from '~/modules'

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
tippy.setDefaults({
  delay: 100,
  arrow: true,
  arrowType: 'round'
})

export default async ({ app, isDev }, inject) => {
  // Environment Information
  debug('Enviroment', {
    env: process.env.NODE_ENV,
    rootPath: $tools.utils.getRootPath(),
    isStatic: $tools.utils.pack.isStatic()
  })

  // User settings
  $settings.init()
  inject('settings', $settings)

  // Analytics
  // App settings
  await $nucleus.init()
  inject('nucleus', $nucleus)

  // Error reporting
  $rollbar.init()

  // DreamTime information
  dream.init()
  window.$dream = dream
  app.context.$dream = dream
  inject('dream', dream)

  // Updates information
  updater.init()
  app.context.$updater = updater
  inject('updater', updater)

  // Platform information
  await platform.init()
  app.context.$platform = platform
  inject('platform', platform)

  // Nudify process
  nudify.init()
  app.context.$nudify = nudify
  inject('nudify', nudify)

  Vue.config.errorHandler = (err, vm, info) => {
    // Report Vue.js Errors
    if ($rollbar.can()) {
      $rollbar.error(err)
    }
  }

  // axios - default headers
  // $axios.setHeader('X-Requested-With', 'XMLHttpRequest')

  // Debug
  debug('The front-end is ready to render!', { app })
}
