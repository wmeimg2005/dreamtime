const { api } = require('electron-utils')

module.exports = {
  /**
   * Open the given file in the desktop's default manner.
   * https://electronjs.org/docs/api/shell#shellopenitemfullpath
   *
   * @param {string} fullPath
   */
  openItem(fullPath) {
    return api.shell.openItem(fullPath)
  },

  /**
   * Open the given external protocol URL in the desktop's default manner. (For example, mailto: URLs in the user's default mail agent).
   * https://electronjs.org/docs/api/shell#shellopenexternalurl-options
   *
   * @param {string} url
   */
  openExternal(url) {
    return api.shell.openExternal(url)
  },

  /**
   *
   * @param  {...any} args
   */
  showOpenDialog(...args) {
    return api.dialog.showOpenDialog(...args)
  }
}
