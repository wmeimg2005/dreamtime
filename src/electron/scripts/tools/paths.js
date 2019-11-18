/*
 * DreamTime | (C) 2019 by Ivan Bravo Bravo <ivan@dreamnet.tech>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License 3.0 as published by
 * the Free Software Foundation.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

const fs = require('fs')
const path = require('path')
const utils = require('electron-utils')

module.exports = {
  /**
   * Returns an absolute path depending on the parameters
   *
   * @param {string} name Name of the base path: https://electronjs.org/docs/all#appgetpathname
   * @param {string} args Series of path segments to join into one path
   */
  get(name, ...args) {
    const { app } = utils.api
    const folderPath = app.getPath(name)

    return path.join(folderPath, ...args)
  },

  /**
   *
   * @param  {...any} args
   */
  getGui(...args) {
    if (process.platform === 'darwin') {
      // /Applications/DreamTime.app/Contents/MacOS/DreamTime
      // /Applications/DreamTime.app/Contents
      return this.get('exe', '..', '..', ...args)
    }

    return this.get('exe', '..', ...args)
  },

  /**
   * @param  {...any} args
   */
  getGuiResources(...args) {
    if (process.platform === 'darwin') {
      return this.getGui('Resources', ...args)
    }

    return this.getGui('resources', ...args)
  },

  /**
   *
   * @param  {...any} args
   */
  getCli(...args) {
    let folder = $settings.folders.cli

    if (!fs.existsSync(folder)) {
      folder = this.get('userData', 'dreampower')
    }

    return path.join(folder, ...args)
  },

  /**
   *
   * @param  {...any} args
   */
  getCheckpoints(...args) {
    return this.getCli('checkpoints', ...args)
  },

  getCropped(...args) {
    let folder = $settings.folders.cropped

    if (!fs.existsSync(folder)) {
      folder = this.get('temp')
    }

    return path.join(folder, ...args)
  },

  getModels(...args) {
    let folder = $settings.folders.models

    if (!fs.existsSync(folder)) {
      folder = this.get('userData', 'models')
    }

    if (!fs.existsSync(folder)) {
      folder = this.get('temp')
    }

    return path.join(folder, ...args)
  },

  getMasks(...args) {
    let folder = $settings.folders.masks

    if (!fs.existsSync(folder)) {
      folder = this.get('userData', 'masks')
    }

    if (!fs.existsSync(folder)) {
      folder = this.get('temp')
    }

    return path.join(folder, ...args)
  },
}
