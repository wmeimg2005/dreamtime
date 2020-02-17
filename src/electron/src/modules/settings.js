// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import fs from 'fs-extra'
import {
  round, cloneDeep, isNil, isEmpty, isPlainObject, get, set,
} from 'lodash'
import { AppError } from './app-error'
import { paths, system } from './tools'

const logger = require('@dreamnet/logplease').create('settings')

/**
 * User settings.
 */
class Settings {
  /**
   * the payload.
   * a proxy will be used to get or set this information.
   *
   * @type {Object}
   */
  payload = {}

  /**
   * @type {Object}
   */
  _default = {}

  /**
   * file where to save the payload.
   *
   * @type {string}
   */
  get path() {
    if (process.env.BUILD_PORTABLE) {
      return paths.getAppPath('AppData', 'settings.json')
    }

    return paths.getPath('userData', 'settings.json')
  }

  /**
   * Load the settings.
   */
  async load() {
    if (isNil(this.path)) {
      return
    }

    try {
      this.payload = fs.readJsonSync(this.path)
      logger.debug('Settings:', this.payload)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }

  /**
   * Save the settings file.
   * This function is called automatically.
   */
  async save() {
    fs.writeJsonSync(this.path, this.payload, { spaces: 2 })
    logger.debug('Settings saved!')
  }

  /**
   * @param {string} path
   */
  get(path = '') {
    if (isEmpty(path)) {
      return this.payload
    }

    return get(this.payload, path)
  }

  /**
   * @param {string} path
   * @param {any} payload
   */
  set(path, payload) {
    if (isPlainObject(path)) {
      this.payload = path
    } else {
      this.payload = set(this.payload, path, payload)
    }
  }

  /**
   *
   */
  async boot() {
    this._loadDefault()
    await this.load()
  }

  /**
   * Setup service
   */
  async setup() {
    await this._create()
    await this._upgrade()
  }

  /**
   * Load the default configuration (and the current version)
   */
  _loadDefault() {
    const uuid = require('uuid')
    const hasGPU = process.platform === 'darwin' ? false : system.graphics.length > 0
    const cores = round(system.cpu?.cores / 2) || 1

    this.payload = {
      version: 7,
      user: uuid(),

      wizard: {
        welcome: false,
        tos: false,
        user: false,
        telemetry: false,
      },

      achievements: {
        badtime: false,
      },

      app: {
        disableHardwareAcceleration: false,
        uploadMode: 'none',
        queuePosition: 'right',
      },

      notifications: {
        run: false,
        allRuns: true,
        update: true,
      },

      folders: {
        cropped: paths.getPath('temp'),
        models: paths.getPath('userData', 'Pictures'),
        masks: paths.getPath('temp'),
        cli: paths.getPath('userData', 'dreampower'),
      },

      telemetry: {
        bugs: true,
        dom: true,
      },

      processing: {
        device: hasGPU ? 'GPU' : 'CPU',
        gpus: [0],
        cores,
        usePython: false,
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
            size: 1,
            randomize: {
              enabled: true,
              min: 0.3,
              max: 2,
            },
            progressive: true,
          },
          areola: {
            size: 1,
            randomize: {
              enabled: true,
              min: 0.3,
              max: 2,
            },
            progressive: true,
          },
          nipple: {
            size: 1,
            randomize: {
              enabled: true,
              min: 0.3,
              max: 2,
            },
            progressive: true,
          },
          vagina: {
            size: 0.75,
            randomize: {
              enabled: true,
              min: 0.3,
              max: 1.5,
            },
            progressive: true,
          },
          pubicHair: {
            size: 1,
            randomize: {
              enabled: true,
              min: 0,
              max: 2,
            },
            progressive: true,
          },
        },

        advanced: {
          scaleMode: 'overlay',
          transformMode: 'normal',
          useColorTransfer: false,
          useWaifu: false,
        },
      },
    }

    this._default = cloneDeep(this.payload)
  }

  /**
   * Create the settings file if it does not exist.
   */
  async _create() {
    if (fs.existsSync(this.path)) {
      return
    }

    // default settings now with the system information.
    this._loadDefault()

    try {
      fs.outputFileSync(this.path, JSON.stringify(this._default, null, 2))
    } catch (error) {
      throw new AppError(`Could not create settings file. Please make sure the program has the necessary permissions to write to:\n${this.path}`, { fatal: true, error })
    }
  }

  /**
   * Upgrade the settings file.
   */
  async _upgrade() {
    if (this.payload?.version === this._default.version) {
      return
    }

    logger.debug(`Upgrading settings file to v${this._default.version}`)

    const currentSettings = cloneDeep(this.payload)

    // 1 -> 2
    if (this.payload?.version === 1 && this._default.version >= 2) {
      this.payload.version = 2
      this.payload.preferences = this._default.preferences
      this.payload.notifications = this._default.notifications

      const {
        boobsSize,
        areolaSize,
        nippleSize,
        vaginaSize,
        pubicHairSize,
      } = this.payload.preferences

      this.payload.preferences.boobs.size = boobsSize
      this.payload.preferences.areola.size = areolaSize
      this.payload.preferences.nipple.size = nippleSize
      this.payload.preferences.vagina.size = vaginaSize
      this.payload.preferences.pubicHair.size = pubicHairSize
    }

    // 2 -> 3
    if (this.payload?.version === 2 && this._default.version >= 3) {
      const { processing, preferences } = currentSettings

      this.payload.version = 3

      this.payload.processing = {
        ...processing,
        cores: 4,
        disablePersistentGan: false,
      }

      this.payload.preferences = {
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

    // 3 -> 4
    if (this.payload?.version === 3 && this._default.version >= 4) {
      this.payload.version = 4
      this.payload.app = {
        disableHardwareAcceleration: false,
        uploadMode: 'add-queue',
      }
    }

    // 4 -> 5
    if (this.payload?.version === 4 && this._default.version >= 5) {
      this.payload.version = 5
      this.payload.preferences.advanced.transformMode = 'normal'
    }

    // 5 -> 6
    if (this.payload?.version === 5 && this._default.version >= 6) {
      this.payload.version = 6

      delete this.payload.welcome

      this.payload.wizard = {
        welcome: false,
        tos: false,
        user: false,
        telemetry: false,
      }

      this.payload.telemetry = {
        bugs: true,
        dom: true,
      }

      this.payload.achievements = {
        badtime: false,
      }

      const { body } = this.payload.preferences

      body.boobs.randomize = {
        enabled: true,
        min: 0.3,
        max: 2,
      }

      body.areola.randomize = {
        enabled: true,
        min: 0.3,
        max: 2,
      }

      body.nipple.randomize = {
        enabled: true,
        min: 0.3,
        max: 2,
      }

      body.vagina.randomize = {
        enabled: true,
        min: 0.3,
        max: 1.5,
      }

      body.pubicHair.randomize = {
        enabled: true,
        min: 0,
        max: 2,
      }
    }

    // 6 -> 7
    if (this.payload?.version === 6 && this._default.version >= 7) {
      this.payload.version = 7
      this.payload.app.queuePosition = 'right'
    }

    this.save()
  }
}

export const theSettings = new Settings

const saveHandler = {
  get(target, property, receiver) {
    try {
      return new Proxy(target[property], saveHandler)
    } catch (err) {
      return Reflect.get(target, property, receiver)
    }
  },
  set(target, property, value, receiver) {
    const response = Reflect.set(target, property, value, receiver)
    theSettings.save()
    return response
  },
  defineProperty(target, property, descriptor) {
    const response = Reflect.defineProperty(target, property, descriptor)
    theSettings.save()
    return response
  },
}

const handler = {
  get(target, property, receiver) {
    try {
      if (property in target) {
        return target[property]
      }

      if (property in target.payload) {
        return new Proxy(target.payload[property], saveHandler)
      }
      // eslint-disable-next-line no-empty
    } catch (err) { }

    if (property in target.payload) {
      return target.payload[property]
    }

    return Reflect.get(target, property, receiver)
  },
}

export const settings = new Proxy(theSettings, handler)
