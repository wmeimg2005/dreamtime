const { remote } = require('electron')
const { makeServiceProxy } = require('./modules/services')

const util = remote.require('electron-util')
const Logger = remote.require('logplease')
const { AppError } = remote.require('./modules/app-error')
const services = remote.require('./modules/services')
const updater = remote.require('./modules/updater')
const tools = remote.require('./modules/tools')

// tools provider
window.$provider = {
  services: {
    nucleus: makeServiceProxy(services.nucleus),
    rollbar: makeServiceProxy(services.rollbar),
    settings: makeServiceProxy(services.settings),
  },

  tools,
  updater,

  api: util.api,
  util,
}

// logger
window.Logger = Logger

// application error
window.AppError = AppError
