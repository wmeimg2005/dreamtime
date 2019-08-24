import _ from 'lodash'
import moment from 'moment'
import Deferred from 'deferred'

import File from '../file'
import Timer from '../timer'
import { rand } from '../helpers'
import WebError from '~/modules/web-error'

import cliErrors from '../config/cli-errors'
import preferencesConfig from '../config/preferences'

const debug = require('debug').default('app:modules:models:photo-job')

export default class PhotoJob {
  constructor(id, photo) {
    this.id = id
    this.photo = photo

    // Transformation Process event bus
    this.process = undefined

    // Output file, this is the photo already transformed!
    this.file = File.fromPath(photo.getFolderPath(this.getFileName()))

    // Clean initialization
    this.reset()

    /*
    this.debug(`Job created`, {
      id: this.id,
      photo: this.photo,
      file: this.file
    })
    */
  }

  /**
   * Restart the information for a possible remake
   */
  reset() {
    // CLI messages
    this.cli = {
      lines: [],
      error: ''
    }

    // Transformation Preferences
    this.preferences = _.cloneDeep(this.photo.preferences)

    this.isLoading = false
    this.hasFailed = false
    this.hasFinished = false

    this.timer = new Timer()
    this.file.remove()
  }

  /**
   *
   * @param {*} message
   * @param  {...any} args
   */
  debug(message, ...args) {
    debug(`[${this.id}] ${message} `, ...args)
  }

  /**
   * The Job has begun
   */
  onStart() {
    this.isLoading = true
    this.timer.start()
  }

  /**
   * The Job has finished successfully
   */
  onFinish() {
    this.isLoading = false
    this.hasFinished = true
    this.timer.stop()

    const activeWindow = $tools.utils.activeWindow()

    if (!activeWindow.isFocused() && $settings.notifications.run) {
      const notification = new Notification(`💭 Run #${this.id} has finished`, {
        body: 'Now you can save the dream'
      })

      notification.onclick = () => {
        activeWindow.focus()
      }
    }
  }

  /**
   * The Job has failed
   */
  onFail() {
    this.isLoading = false
    this.hasFailed = true
    this.timer.stop()
  }

  /**
   * ID. Execution Number
   */
  getId() {
    return this.id
  }

  /**
   *
   */
  getPhoto() {
    return this.photo
  }

  /**
   *
   */
  getPreferences() {
    return this.preferences
  }

  /**
   * Transformed File Name
   */
  getFileName() {
    const now = moment().unix()

    // Original name normalized to avoid problems
    const originalName = _.truncate(
      _.deburr(this.photo.getSourceFile().getName()),
      { length: 30, omission: '' }
    )

    return `${originalName}-${this.id}-${now}-dreamtime.png`
  }

  /**
   *
   */
  getFile() {
    return this.file
  }

  /**
   *
   */
  getCliError() {
    const message = this.cli.error

    if (!_.isString(message) || message.length === 0) {
      return { type: 'debug', message: '' }
    }

    for (const payload of cliErrors) {
      if (message.includes(payload.error)) {
        return {
          type: payload.type,
          message: payload.message
        }
      }
    }

    return {
      type: 'error',
      message: `The process has been interrupted by an unknown error, this may be caused by a corrupt installation, please check the console for more information.`
    }
  }

  /**
   *
   */
  cancel() {
    if (!this.isLoading || _.isNil(this.process)) {
      return
    }

    this.process.emit('kill')
  }

  /**
   *
   */
  beforeStart() {
    this.customizePreferences()
  }

  /**
   *
   */
  customizePreferences() {
    if (this.preferences.randomizePreferences) {
      // Randomize
      _.forIn(preferencesConfig, (payload, key) => {
        if (this.preferences[key].randomize) {
          this.preferences[key].size = rand(payload.min, payload.max)
        }
      })
    } else if (this.preferences.progressivePreferences) {
      // Progressive
      const add = 0.1 * (this.id - 1)

      _.forIn(preferencesConfig, (payload, key) => {
        if (this.preferences[key].progressive) {
          let value = Number.parseFloat(this.preferences[key].size)
          value = Math.min(value + add, payload.max)

          this.preferences[key].size = value
        }
      })
    }
  }

  /**
   *
   */
  start() {
    const deferred = Deferred()

    const onSpawnError = (error) => {
      deferred.reject(
        new WebError(
          'Unable to start DreamPower!',
          `There was a problem trying to start DreamPower, in **Settings** please make sure that the option **DreamPower Folder** is valid, if you are not a developer make sure that the option **Use Python** is disabled.`,
          {
            error,
            type: 'debug'
          }
        )
      )
    }

    this.beforeStart()

    try {
      this.process = $tools.transform(this)
    } catch (error) {
      setTimeout(() => {
        onSpawnError(error)
      }, 0)
      return deferred.promise
    }

    this.process.on('error', (error) => {
      // Error before starting
      onSpawnError(error)
    })

    this.process.on('stdout', (output) => {
      // Output generated by the CLI
      output = output
        .toString()
        .trim()
        .split('\n')

      output.forEach((text) => {
        this.cli.lines.unshift({
          text,
          css: {}
        })
      })
    })

    this.process.on('stderr', (output) => {
      // CLI error
      this.cli.lines.unshift({
        text: output,
        css: {
          'text-danger': true
        }
      })

      this.cli.error += `${output}\n`
    })

    this.process.on('ready', (code) => {
      this.process = undefined

      if (code === 0 || _.isNil(code)) {
        // The process has been completed successfully
        // Reload the output file information.
        this.file.reload()

        if (this.file.exists()) {
          $nucleus.track('DREAM_COMPLETED')
          deferred.resolve()
        } else {
          deferred.reject(
            new WebError(
              `Transformation #${this.id} failed`,
              'DreamPower has reported that the photo has been transformed but the file does not exist! This may be due to a problem saving the photo, verify that DreamPower has write permissions and that your Antivirus is not detecting false positives. It is also possible that DreamPower is ending abruptly due to a major problem.',
              {
                type: 'warning',
                extra: {
                  output: this.cli.lines
                }
              }
            )
          )
        }
      } else {
        const err = this.getCliError()

        deferred.reject(
          new WebError(`Transformation #${this.id} failed`, err.message, {
            error: Error(this.cli.error),
            type: err.type,
            extra: {
              output: this.cli.lines
            }
          })
        )
      }
    })

    return deferred.promise
  }
}
