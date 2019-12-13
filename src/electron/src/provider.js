const { remote } = require('electron')
const { make } = require('./modules/settings')

const util = remote.require('electron-util')
const { settingsRaw } = remote.require('./modules/settings')
const tools = remote.require('./modules/tools')

// tools provider
window.$provider = {
  ...tools,

  settings: make(settingsRaw),

  api: util.api,
  util,
}
