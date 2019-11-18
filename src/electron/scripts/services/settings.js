// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

const fs = require('fs')
const {
  memoize, isNil, round, cloneDeep,
} = require('lodash')
const uuid = require('uuid')
const { api } = require('electron-utils')
const logger = require('logplease').create('electron:scripts:services:settings')
const { BaseService } = require('./base')
const { AppError } = require('../error')
const { paths, system } = require('../tools')

/**
 * User settings.
 */
class SettingsService extends BaseService {
  /**
   * file where to save the payload.
   *
   * @type {string}
   */
  get path() {
    return memoize(() => paths.get('userData', 'settings.json'))('settings.path')
  }

  /**
   * settings defaults.
   *
   * @type {Object}
   */
  _defaults = {}

  /**
   * Setup service
   */
  async setup() {
    this._setupDefaults()

    await this._create()

    await this.load()

    await this._upgrade()
  }

  _setupDefaults() {
    const hasGPU = system.graphics.length > 0
    const cores = round(system.cores / 2)

    this._default = {
      version: 3,
      welcome: true,
      user: uuid(),

      processing: {
        device: hasGPU ? 'GPU' : 'CPU',
        gpus: [0],
        cores,
        disablePersistentGan: false,
        usePython: process.env.NODE_ENV === 'development',
      },

      preferences: {
        body: {
          executions: 1,
          randomize: false,

          progressive: {
            enabled: false,
            rate: 0.1,
          },

          boobs: {
            size: '1',
            randomize: true,
            progressive: true,
          },
          areola: {
            size: '1',
            randomize: false,
            progressive: true,
          },
          nipple: {
            size: '1',
            randomize: false,
            progressive: true,
          },
          vagina: {
            size: '0.75',
            randomize: true,
            progressive: true,
          },
          pubicHair: {
            size: '1',
            randomize: true,
            progressive: true,
          },
        },

        advanced: {
          scaleMode: 'auto-rescale',
          useColorTransfer: false,
          useWaifu: false,
        },
      },

      notifications: {
        run: false,
        allRuns: true,
        update: true,
      },

      folders: {
        cropped: paths.get('temp'),
        models: paths.get('userData', 'models'),
        masks: paths.get('userData', 'masks'),
        cli: paths.get('userData', 'dreampower'),
      },

      telemetry: {
        enabled: true,
      },
    }
  }

  /**
   * Create the settings file if it does not exist
   */
  async _create() {
    if (fs.existsSync(this.path)) {
      return
    }

    try {
      fs.outputFileSync(this.path, JSON.stringify(this._defaults, null, 2))
    } catch (error) {
      throw new AppError(`Could not create settings file. Please make sure the program has the necessary permissions to write to:\n${this.path}`, { error })
    }
  }

  /**
   * Check if it is necessary to update the settings file.
   * legacy code :WutFaceW:
   */
  async _upgrade() {
    const currentVersion = this._settings.version || 1
    const newVersion = this._default.version

    if (newVersion === currentVersion) {
      return
    }

    const currentSettings = this._settings
    const newSettings = cloneDeep(currentSettings)

    // Upgrade 1 -> 2
    if (currentVersion === 1 && newVersion === 2) {
      newSettings.version = 2
      newSettings.preferences = this._default.preferences
      newSettings.notifications = this._default.notifications

      const {
        boobsSize,
        areolaSize,
        nippleSize,
        vaginaSize,
        pubicHairSize,
      } = this._settings.preferences

      newSettings.preferences.boobs.size = boobsSize
      newSettings.preferences.areola.size = areolaSize
      newSettings.preferences.nipple.size = nippleSize
      newSettings.preferences.vagina.size = vaginaSize
      newSettings.preferences.pubicHair.size = pubicHairSize
    }

    // Upgrade 2 -> 3
    if (currentVersion === 2 && newVersion === 3) {
      const { processing, preferences } = currentSettings

      newSettings.version = 3

      newSettings.processing = {
        ...processing,
        cores: 4,
        disablePersistentGan: false,
      }

      newSettings.preferences = {
        body: {
          executions: preferences.executions,
          randomize: preferences.randomizePreferences,

          progressive: {
            enabled: preferences.progressivePreferences,
            rate: 0.1,
          },

          boobs: preferences.boobs,
          areola: preferences.areola,
          nipple: preferences.nipple,
          vagina: preferences.vagina,
          pubicHair: preferences.pubicHair,
        },

        advanced: {
          scaleMode: 'auto-rescale',
          useColorTransfer: false,
          useWaifu: false,
        },
      }
    }

    this.set(newSettings)
  }
}

module.exports = {
  settings: SettingsService.make(),
}
