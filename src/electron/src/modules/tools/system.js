// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import {
  filter, isString, isNil, isArray, toInteger, get,
} from 'lodash'
import { existsSync, statSync } from 'fs'
import si from 'systeminformation'
import isOnline from 'is-online'
import compareVersions from 'compare-versions'
import filesize from 'filesize'
import { is } from 'electron-util'
import regedit from 'regedit'
import { nucleus } from '../services'
import { getAppResourcesPath, getPowerPath, getCheckpointsPath } from './paths'
import { getVersion } from './power'

const logger = require('logplease').create('system')

class System {
  /**
   * @type {si.Systeminformation.OsData}
   */
  os

  /**
   * @type {si.Systeminformation.GraphicsData}
   */
  _graphics

  /**
   * @type {si.Systeminformation.CpuData}
   */
  cpu

  /**
   * @type {si.Systeminformation.MemData}
   */
  memory

  /**
   * @type {boolean}
   */
  online

  /**
   * @type {Object}
   */
  requirements = {
    power: {
      installed: false,
      compatible: false,
      checkpoints: false,
    },
    windows: {
      media: false,
    },
    ram: {
      minimum: false,
      recommended: false,
    },
    gpuram: {
      minimum: false,
      recommended: false,
    },
  }

  /**
   *
   */
  async setup() {
    const [
      graphics,
      os,
      cpu,
      mem,
      online,
    ] = await Promise.all([
      si.graphics(),
      si.osInfo(),
      si.cpu(),
      si.mem(),
      isOnline(),
    ])

    this._graphics = graphics
    this.os = os
    this.cpu = cpu
    this.memory = mem
    this.online = online

    logger.info(`GPU devices: ${this.graphics.length}`)
    logger.info(`RAM: ${this.memory.total} bytes.`)
    logger.info(`Internet connection: ${this.online}`)
    logger.debug(this)
  }

  /**
   *
   */
  async scan() {
    const { requirements } = this

    // dreampower
    requirements.power.installed = this._hasPower
    requirements.power.compatible = await this._hasCompatiblePower()
    requirements.power.checkpoints = this._hasCheckpoints

    // windows
    requirements.windows.media = await this._hasWindowsMedia()

    // ram
    requirements.ram.recommended = this.memory.total >= 8589934592 // 8 GB
    requirements.ram.minimum = this.memory.total >= 6442450944 // 6 GB

    // gpu ram
    this.requirements = requirements

    logger.info('Requirements:', this.requirements)
  }

  /**
   * @type {boolean}
   */
  get canNudify() {
    return this.requirements.power.installed && this.requirements.power.compatible && this.requirements.power.checkpoints
  }

  /**
   * @type {Array}
   */
  get graphics() {
    return filter(this._graphics.controllers, { vendor: 'NVIDIA' })
  }

  /**
   * @type {boolean}
   */
  get _hasPower() {
    const dirpath = getPowerPath()

    if (!isString(dirpath)) {
      // how the fuck?
      return false
    }

    if (!existsSync(dirpath)) {
      return false
    }

    const binaries = [
      'main.py',
      'dreampower.exe',
      'dreampower',
    ]

    for (const bin of binaries) {
      if (existsSync(getPowerPath(bin))) {
        return true
      }
    }

    return false
  }

  /**
   * @return {boolean}
   */
  async _hasCompatiblePower() {
    if (!this.requirements.power.installed) {
      return false
    }

    const version = await getVersion()

    const minimum = get(nucleus, `projects.dreamtime.releases.v${process.env.npm_package_version}.dreampower.minimum`, 'v1.2.3')
    const maximum = get(nucleus, `projects.dreamtime.releases.v${process.env.npm_package_version}.dreampower.maximum`)

    if (compareVersions.compare(version, minimum, '<')) {
      return false
    }

    if (!isNil(maximum) && compareVersions.compare(version, maximum, '>')) {
      return false
    }

    return true
  }

  /**
   * @type {boolean}
   */
  get _hasCheckpoints() {
    const dirpath = getCheckpointsPath()

    if (!existsSync(dirpath)) {
      return false
    }

    // these files must exist
    const files = ['cm.lib', 'mm.lib', 'mn.lib']

    for (const file of files) {
      const filepath = getCheckpointsPath(file)

      if (!existsSync(filepath)) {
        return false
      }

      const stats = statSync(filepath)
      const size = filesize(stats.size, { exponent: 2, output: 'object' })

      if (size.value < 690) {
        return false
      }
    }

    return true
  }

  /**
   * @return {boolean}
   */
  async _hasWindowsMedia() {
    if (!is.windows) {
      return true
    }

    const version = this.os.release

    if (toInteger(version) < 10) {
      // no windows 10
      return true
    }

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
  }
}

export const system = new System()
