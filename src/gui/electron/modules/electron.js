const isRenderer = require('is-electron-renderer')

if (isRenderer) {
  const { remote } = require('electron')
  module.exports = remote
} else {
  module.exports = require('electron')
}
