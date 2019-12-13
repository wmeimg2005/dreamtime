import { nucleus } from './services'

export default {
  /**
   * @type {string}
   */
  name: process.env.npm_package_displayName,

  /**
   * @type {string}
   */
  version: `v${process.env.npm_package_version}`,

  /**
   *
   */
  setup() {
    this.settings = nucleus
  },
}
