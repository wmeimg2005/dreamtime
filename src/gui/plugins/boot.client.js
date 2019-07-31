import Vue from 'vue'
import moment from 'moment'
import tippy from 'tippy.js'
import BaseMixin from '~/mixins/BaseMixin'
import { dream, platform, nudify } from '~/modules'

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

Vue.config.errorHandler = (err, vm, info) => {
  // Report Vue.js Errors
  if ($rollbar.can()) {
    $rollbar.error(err)
  }
}

export default async ({ app, router }, inject) => {
  // Environment Information
  debug('Enviroment', {
    env: process.env.NODE_ENV,
    rootPath: $utils.getRootPath(),
    isStatic: $utils.pack.isStatic()
  })

  // User settings
  $settings.init()
  app.context.$_settings = $settings
  inject('_settings', $settings)

  // Analytics & App settings
  await $nucleus.init()

  // Error reporting
  $rollbar.init()

  // DreamTime information
  dream.init()
  window.$_dream = dream
  app.context.$_dream = dream
  inject('_dream', dream)

  // Platform information
  await platform.init()
  app.context.$_platform = platform
  inject('_platform', platform)

  // Nudify process
  nudify.init()
  app.context.$_nudify = nudify
  inject('_nudify', nudify)

  // axios - default headers
  // $axios.setHeader('X-Requested-With', 'XMLHttpRequest')

  // Debug
  debug('The front-end is ready to render!', { app })
}
