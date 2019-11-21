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
  // provider shortcuts
  inject('provider', $provider)
  inject('settings', $provider.services.settings)
  inject('nucleus', $provider.services.nucleus)

  // error handlers

  window.addEventListener('error', (err) => {
    logger.warn('Web error!', err)
    WebError.handle(err)

    return true
  })

  window.addEventListener('unhandledrejection', (rejection) => {
    logger.warn('Web Unhandled rejection!', err)
    WebError.handle(rejection.reason)

    return true
  })

  Vue.config.errorHandler = (err) => {
    logger.warn('VueJS error!', err)
    WebError.handle(err)

    throw err
  }

  // dreamtime
  dream.init()
  inject('dream', dream)

  // nudify process
  nudify.init()
  inject('nudify', nudify)

  // ready
  logger.info('The front-end is ready!')
}
