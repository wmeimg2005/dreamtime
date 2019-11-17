const fs = require('fs')
const _ = require('lodash')
const uuid = require('uuid')
const { api } = require('electron-utils')
const debug = require('debug').default('app:electron:modules:settings')

const tools = require('../tools')

/**
 * User settings.
 * This class is responsible for loading, saving and offering easy access to user settings.
 *
 * Examples:
 * settings.processing.device -> 'CPU'
 *
 * settings.telemetry.enabled = false
 * settings.save()
 */
const settings = {
  /**
   * Initialize the settings
   */
  async init() {
    await this._initDefault()

    this._path = tools.paths.get('userData', 'settings.json')
    this._settings = {}

    await this._ensure()

    this.load()

    await this._upgrade()
  },

  /**
   *
   */
  async _initDefault() {
    let hasGPU = false

    try {
      hasGPU = (await tools.getGpusList()).length > 0
      // eslint-disable-next-line
    } catch (err) { }

    this._default = {
      version: 3,
      welcome: true,
      user: uuid(),

      processing: {
        device: hasGPU ? 'GPU' : 'CPU',
        gpus: [0],
        cores: 4,
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
        cropped: tools.paths.get('temp'),
        models: tools.paths.get('userData', 'models'),
        masks: tools.paths.get('userData', 'masks'),
        cli: tools.paths.get('userData', 'dreampower'),
      },

      telemetry: {
        enabled: true,
      },
    }
  },

  /**
   * Make sure the settings file exists
   */
  async _ensure() {
    if (fs.existsSync(this._path)) {
      // Exists
      return
    }

    try {
      fs.writeFileSync(this._path, JSON.stringify(this._default, null, 2))
    } catch (err) {
      api.dialog.showErrorBox(
        'The program could not be started',
        `An error occurred while trying to save the settings, please make sure the program has the necessary permissions to write to:\n${this._path}`,
      )

      api.app.exit()
    }
  },

  /**
   * Check if it is necessary to update the settings file.
   * - Ugly code, here we go!
   */
  async _upgrade() {
    const currentVersion = this._settings.version || 1
    const newVersion = this._default.version

    if (newVersion === currentVersion) {
      return
    }

    const currentSettings = this._settings
    const newSettings = _.cloneDeep(currentSettings)

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
  },

  /**
   * Returns the value of the settings in the path
   *
   * @param {string} path
   */
  get(path = '') {
    if (path.length === 0) {
      return this._settings
    }

    return _.get(this._settings, path)
  },

  /**
   * Set a new value in the settings
   *
   * @param {any} path
   * @param {any} payload
   */
  set(path, payload) {
    if (_.isPlainObject(path)) {
      this._settings = path
      this.save()
    }

    this._settings = _.set(this._settings, path, payload)
    this.save()
  },

  /**
   * Load the settings file. If it is already loaded then it refreshes.
   */
  async load() {
    this._settings = JSON.parse(fs.readFileSync(this._path))
    debug('User Settings loaded!', { path: this._path, settings: this._settings })
  },

  /**
   * Save the settings.
   * This function is called automatically if you set a first level variable.
   */
  async save() {
    const payload = JSON.stringify(this._settings, null, 2)
    fs.writeFileSync(this._path, payload)

    if (window && window.$rollbar) {
      $rollbar.configure({
        payload: {
          settings: this._settings,
        },
      })
    }
  },
}

module.exports = new Proxy(settings, {
  get: (obj, prop) => {
    if (prop in obj) {
      return obj[prop]
    }

    /* eslint-disable no-underscore-dangle */
    if (prop in obj._settings) {
      return obj._settings[prop]
    }
    /* eslint-enable no-underscore-dangle */

    return undefined
  },

  set: (obj, prop, value) => {
    /* eslint-disable no-underscore-dangle */
    if (!_.isNil(obj._settings)) {
      if (prop in obj._settings) {
        obj._settings[prop] = value
        obj.save()

        return true
      }
    }
    /* eslint-enable no-underscore-dangle */

    obj[prop] = value
    return true
  },
})
