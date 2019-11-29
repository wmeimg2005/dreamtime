/* eslint-disable-next-line */
const debug = require('debug').default('app:modules:app')

export default {
  name: process.env.npm_package_displayName,

  version: `v${process.env.npm_package_version}`,

  status: 'stable',

  /**
   *
   */
  setup() {
    this.settings = $provider.services.nucleus
  },
}
