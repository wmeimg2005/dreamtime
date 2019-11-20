/* eslint-disable no-param-reassign */
import Vue from 'vue'
import moment from 'moment'
import tippy from 'tippy.js'
import BaseMixin from '~/mixins/BaseMixin'
import {
  dream, platform, updater, nudify, WebError,
} from '~/modules'

const logger = require('logplease').create('plugins:boot')

// lift off!
logger.info('Lift off!')

// base mixin
Vue.mixin(BaseMixin)

// momentjs
moment.locale('en')

// tippyjs
tippy.setDefaultProps({
  delay: 100,
  arrow: true,
})

export default async ({ app }, inject) => {
  inject('provider', $provider)

  console.log($provider)

  /*
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
  */
}
