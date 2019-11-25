/* eslint-disable no-param-reassign */
import Vue from 'vue'
import moment from 'moment'
import tippy from 'tippy.js'
import swal from 'sweetalert'
import { isError } from 'lodash'
import { ipcRenderer } from 'electron'
import BaseMixin from '~/mixins/BaseMixin'
import {
  dream, nudify,
} from '~/modules'

const logger = Logger.create('plugins:boot')

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

// eslint-disable-next-line no-unused-vars
export default async ({ app }, inject) => {
  // provider shortcuts
  inject('provider', $provider)
  inject('settings', $provider.services.settings)
  inject('nucleus', $provider.services.nucleus)

  ipcRenderer.on('alert', (event, payload) => {
    swal(payload)
  })

  // error handlers

  const handleError = (error, quiet = false) => {
    let message
    let stack
    let options = { quiet }

    if (isError(error)) {
      message = error.message
      stack = error.stack

      if (error instanceof AppError) {
        options = error.options
      }
    } else {
      message = error
      stack = (new Error('dummy')).stack
    }

    AppError.handleRenderer(message, stack, options)
  }

  window.addEventListener('error', (err) => {
    handleError(err)
    return true
  })

  window.addEventListener('unhandledrejection', (rejection) => {
    handleError(rejection.reason)
    return true
  })

  Vue.config.errorHandler = (err) => {
    handleError(err, true)
    throw err
  }

  // dreamtime
  dream.setup()
  inject('dream', dream)

  // nudify process
  nudify.init()
  inject('nudify', nudify)

  // ready
  logger.info('The front-end is ready!')
}
