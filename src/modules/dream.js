/* eslint-disable-next-line */
const debug = require('debug').default('app:modules:app')

export default {
  /**
   *
   */
  init() {
    this.name = process.env.npm_package_displayName
    this.version = `v${process.env.npm_package_version}`
    this.status = 'stable'
    this.settings = $provider.services.nucleus
  },
}
