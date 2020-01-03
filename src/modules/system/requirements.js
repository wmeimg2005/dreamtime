// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import { isNil, startsWith, pick } from 'lodash'
import { remote } from 'electron'
import { Consola } from '../consola'

const consola = Consola.create('requirements')

const { system, fs } = $provider
const { is } = $provider.util
const { getVersion, isInstalled } = $provider.power
const { getAppResourcesPath, getCheckpointsPath } = $provider.paths

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

  get values() {
    return pick(this, 'power', 'windows', 'recommended')
  },

  /**
   * @type {boolean}
   */
  get canNudify() {
    return this.power.installed && this.power.compatible && this.power.checkpoints
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

    consola.info(this.values)
  },

  /**
   * @return {boolean}
   */
  async _hasCompatiblePower() {
    if (!this.power.installed) {
      return false
    }

    const { nucleus } = require('../services')

    const compareVersions = require('compare-versions')
    let version

    try {
      version = await getVersion()
      const currentVersion = process.env.npm_package_version

      const minimum = nucleus.v1?.projects?.dreamtime?.releases[`v${currentVersion}`]?.dreampower?.minimum || 'v0.0.1'
      const maximum = nucleus.v1?.projects?.dreamtime?.releases[`v${currentVersion}`]?.dreampower?.maximum

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
  },
}
