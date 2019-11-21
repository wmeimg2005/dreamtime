const { remote } = require('electron')

const { AppError } = remote.require('./modules/app-error')
const services = remote.require('./modules/services')
const tools = remote.require('./modules/tools')

// main process provider
window.$provider = {
  AppError,
  services,
  tools,
}
