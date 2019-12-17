const { remote } = require('electron')
const { make } = require('./modules/settings')

const util = remote.require('electron-util')
const { settingsRaw } = remote.require('./modules/settings')
const tools = remote.require('./modules/tools')
const ngrok = remote.require('./modules/ngrok')

// tools provider
window.$provider = {
  ...tools,

  settings: make(settingsRaw),
  ngrok,

  api: util.api,
  util,
}
