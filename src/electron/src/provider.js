const { remote } = require('electron')
const { makeServiceProxy } = require('./modules/services')

const util = remote.require('electron-util')
const services = remote.require('./modules/services')
const tools = remote.require('./modules/tools')

// tools provider
window.$provider = {
  services: {
    nucleus: makeServiceProxy(services.nucleus),
    rollbar: makeServiceProxy(services.rollbar),
    settings: makeServiceProxy(services.settings),
  },

  tools,

  api: util.api,
  util,
}
