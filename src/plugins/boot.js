/* eslint-disable no-param-reassign */
import Vue from 'vue'
import moment from 'moment'
import tippy from 'tippy.js'
import Logger from 'logplease'
import BaseMixin from '~/mixins/BaseMixin'
import { AppError, dream } from '~/modules'
import { Nudify } from '~/modules/nudify'

const logger = Logger.create('plugins:boot')

const { getPath } = $provider.tools.paths

// logger setup
Logger.setLogLevel(process.env.LOG || 'info')
Logger.setLogfile(getPath('userData', 'renderer.log'))

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

// global apperror
window.AppError = AppError

// eslint-disable-next-line no-unused-vars
export default async ({ app }, inject) => {
  // provider shortcuts
  inject('provider', $provider)
  inject('settings', $provider.services.settings)
  inject('nucleus', $provider.services.nucleus)

  /*
  ipcRenderer.on('alert', (event, payload) => {
    swal(payload)
  })
  */

  // error handlers

  /*
  const handleError = (error, quiet = false) => {
    let message
    let stack
    let options = { quiet }

    if (isError(error)) {
      message = error.message
      stack = error.stack

      if (error.options) {
        options = error.options
      }
    } else {
      message = error
      stack = (new Error('dummy')).stack
    }

    console.log(options, options.error)

    logger.debug('Handling error.', {
      message,
      stack,
      options,
    })

    AppError.handleRenderer(message, stack, options)
  }
  */

  window.addEventListener('error', (err) => {
    AppError.handle(err)
    return true
  })

  window.addEventListener('unhandledrejection', (rejection) => {
    AppError.handle(rejection.reason)
    return true
  })

  Vue.config.errorHandler = (err) => {
    AppError.handle(err)
    throw err
  }

  // dreamtime
  dream.setup()
  inject('dream', dream)

  // nudify process
  Nudify.setup()
  inject('nudify', Nudify)

  // ready
  logger.info('The front-end is ready!')
}
