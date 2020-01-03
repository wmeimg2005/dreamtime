const { remote } = require('electron')

const util = remote.require('electron-util')
const { settings } = remote.require('./modules/settings')
const tools = remote.require('./modules/tools')
const ngrok = remote.require('./modules/ngrok')

// tools provider
window.$provider = {
  ...tools,

  settings,
  ngrok,

  api: util.api,
  util,
}
