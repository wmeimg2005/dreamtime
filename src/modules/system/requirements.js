// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import {
  isNil, startsWith, pick, clone, deburr,
} from 'lodash'
import { remote } from 'electron'
import emojiStrip from 'emoji-strip'
import { Consola } from '../consola'
import { settings } from './settings'

const consola = Consola.create('requirements')

const { system, fs } = $provider
const { is } = $provider.util
const { getVersion, isInstalled } = $provider.power
const { getAppResourcesPath, getCheckpointsPath, getModelsPath } = $provider.paths

export const requirements = {
  power: {
    installed: false,
    compatible: false,
    checkpoints: false,
  },

  windows: {
    media: false,
  },

  recommended: {
    ram: false,
    vram: false,
  },

  folders: {
    models: false,
  },

  get values() {
    return pick(this, 'power', 'windows', 'recommended')
  },

  /**
   * @type {boolean}
   */
  get canNudify() {
    return this.power.installed && this.power.compatible && this.power.checkpoints
  },

  get hasAlerts() {
    if (!this.windows.media) {
      return true
    }

    if (!this.recommended.ram) {
      return true
    }

    if (settings.processing.device === 'GPU' && !this.recommended.vram) {
      return true
    }

    if (!this.folders.models) {
      return true
    }

    return false
  },

  /**
   *
   */
  async setup() {
    // dreampower
    this.power.installed = isInstalled()
    this.power.compatible = await this._hasCompatiblePower()
    this.power.checkpoints = this._hasCheckpoints

    // windows
    this.windows.media = await this._hasWindowsMedia()

    // ram
    this.recommended.ram = system.memory.total >= 8589934592 // 8 GB
    this.recommended.vram = system.graphics[0]?.vram >= 4000 // Win32_VideoController does not scan VRAM above 4GB

    // Folders
    this.folders.models = this.isValidFolder(getModelsPath())

    consola.info(this.values)
  },

  /**
   *
   * @param {string} path
   */
  isValidFolder(path) {
    const original = clone(path)

    let fixed = clone(path)
    fixed = deburr(fixed)
    fixed = emojiStrip(fixed)

    // eslint-disable-next-line no-control-regex
    fixed = fixed.replace(/[^\x00-\x7F]/g, '')

    return original === fixed
  },

  /**
   * @return {boolean}
   */
  async _hasCompatiblePower() {
    if (!this.power.installed) {
      return false
    }

    const { dreamtrack } = require('../services')

    const compareVersions = require('compare-versions')
    let version

    try {
      version = await getVersion()
      const currentVersion = `v${process.env.npm_package_version}`

      const minimum = dreamtrack.get(['projects', 'dreamtime', 'releases', currentVersion, 'dreampower', 'minimum'], 'v0.0.1')
      const maximum = dreamtrack.get(['projects', 'dreamtime', 'releases', currentVersion, 'dreampower', 'maximum'])

      if (compareVersions.compare(version, minimum, '<')) {
        return false
      }

      if (!isNil(maximum) && compareVersions.compare(version, maximum, '>')) {
        return false
      }

      return true
    } catch (err) {
      consola.warn(`DreamPower version verification failed. (${version}).`, err)
      return false
    }
  },

  /**
   * @type {boolean}
   */
  get _hasCheckpoints() {
    const dirpath = getCheckpointsPath()

    if (!fs.existsSync(dirpath)) {
      return false
    }

    const filesize = require('filesize')

    // these files must exist
    const files = ['cm.lib', 'mm.lib', 'mn.lib']

    for (const file of files) {
      const filepath = getCheckpointsPath(file)

      if (!fs.existsSync(filepath)) {
        return false
      }

      const stats = fs.statSync(filepath)
      const size = filesize(stats.size, { exponent: 2, output: 'object' })

      if (size.value < 690) {
        return false
      }
    }

    return true
  },

  /**
   * @return {boolean}
   */
  async _hasWindowsMedia() {
    if (!is.windows) {
      return true
    }

    const version = system.os.release

    if (!startsWith(version, '10')) {
      // no windows 10.
      return true
    }

    try {
      const regedit = remote.require('regedit')

      if (!is.development) {
        // regedit commands
        regedit.setExternalVBSLocation(
          getAppResourcesPath('vbs'),
        )
      }

      const value = await new Promise((resolve) => {
        const regKey = 'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Setup\\WindowsFeatures'

        regedit.list(regKey, (err, result) => {
          if (!isNil(err)) {
            resolve(false)
            return
          }

          resolve(result[regKey].keys.includes('WindowsMediaVersion'))
        })
      })

      return value
    } catch (error) {
      consola.warn(error)
      return false
    }
  },
}
