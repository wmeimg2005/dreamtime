// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import {
  isNil, isEmpty, truncate, deburr, forIn, cloneDeep,
} from 'lodash'
import deferred from 'deferred'
import moment from 'moment'
import { File } from '../file'
import { Timer } from '../timer'
import { rand } from '../helpers'
import cliErrors from '../config/cli-errors'
import preferencesConfig from '../config/preferences'

const { settings, nucleus } = $provider.services
const { transform } = $provider.tools.power
const { activeWindow } = $provider.util

export class PhotoRun {
  /**
   * @type {string}
   */
  id

  /**
   * @type {require('./photo').Photo}
   */
  photo

  /**
   * @type {Object}
   */
  process

  /**
   * @type {File}
   */
  outputFile

  /**
   * @type {string}
   */
  status = 'pending'

  /**
   * @type {Boolean}
   */
  failed = false

  /**
   * @type {Object}
   */
  preferences = {}

  /**
   * @type {Timer}
   */
  timer = new Timer()

  /**
   * @type {Object}
   */
  cli = {
    lines: [],
    error: '',
  }

  get running() {
    return this.status === 'running'
  }

  get pending() {
    return this.status === 'pending'
  }

  get finished() {
    return this.status === 'finished'
  }

  get started() {
    return this.status !== 'pending'
  }

  get outputName() {
    const now = moment().unix()
    const { file } = this.photo

    const originalName = truncate(
      deburr(file.name),
      { length: 30, omission: '' },
    )

    const extension = file.mimetype === 'image/gif' ? 'gif' : 'png'

    return `${originalName}-${now}-dreamtime.${extension}`
  }

  constructor(id, photo) {
    this.id = id
    this.photo = photo

    // output file
    this.outputFile = new File(photo.getFolderPath(this.outputName))

    // preferences
    this.preferences = cloneDeep(this.photo.preferences)
  }

  reset() {
    this.cli = {
      lines: [],
      error: '',
    }

    this.preferences = cloneDeep(this.photo.preferences)

    this.status = 'pending'
    this.failed = false

    this.timer = new Timer()
  }

  toObject() {
    return {
      photo: {
        inputFile: this.photo.inputFile,
        overlay: this.photo.overlay,
      },
      outputFile: this.outputFile,
      preferences: this.preferences,
    }
  }

  beforeStart() {
    this.setupPreferences()
  }

  start() {
    const def = deferred()

    const onSpawnError = (error) => {
      def.reject(new AppError('There was a problem trying to start DreamPower, make sure you have everything set up correctly.', { title: 'DreamPower failed!', error, level: 'warn' }))
    }

    this.beforeStart()

    try {
      this.process = transform(this.toObject())
    } catch (error) {
      onSpawnError(error)
      return def.promise
    }

    this.process.on('error', (error) => {
      // spawn error
      onSpawnError(error)
    })

    this.process.on('stdout', (output) => {
      // cli output
      output.forEach((text) => {
        this.cli.lines.unshift({
          text,
          css: {},
        })
      })
    })

    this.process.on('stderr', (output) => {
      // cli error
      this.cli.lines.unshift({
        text: output,
        css: {
          'text-danger': true,
        },
      })

      this.cli.error += `${output}\n`
    })

    this.process.on('success', async () => {
      await this.outputFile.open()
      nucleus.track('DREAM_COMPLETED')
      def.resolve()
    })

    this.process.on('fail', (fileError) => {
      if (fileError) {
        def.reject(new AppError('DreamPower has transformed the photo but could not save it.', { title: `Run ${this.id} failed!`, level: 'warn' }))
      } else {
        console.log(this.getPowerError())
        def.reject(this.getPowerError())
      }
    })

    return def.promise
  }

  cancel() {
    if (!this.running || isNil(this.process)) {
      return
    }

    this.process.emit('kill')
  }

  setupPreferences() {
    const preferences = this.preferences.body

    if (preferences.randomize) {
      // randomize
      forIn(preferencesConfig, (payload, key) => {
        if (preferences[key].randomize) {
          preferences[key].size = rand(payload.min, payload.max)
        }
      })
    } else if (preferences.progressive.enabled) {
      // progressive
      const add = preferences.progressive.rate * (this.id - 1)

      forIn(preferencesConfig, (payload, key) => {
        if (preferences[key].progressive) {
          let value = Number.parseFloat(preferences[key].size)
          value = Math.min(value + add, payload.max)

          preferences[key].size = value
        }
      })
    }

    this.preferences.body = preferences
  }

  onStart() {
    this.status = 'running'
    this.timer.start()

    this.photo.events.emit('update')
  }

  onFinish() {
    this.status = 'finished'
    this.timer.stop()

    this._sendNotification()

    this.photo.events.emit('update')
  }

  onFail() {
    this.status = 'finished'
    this.failed = true
    this.timer.stop()

    this.photo.events.emit('update')
  }

  getPowerError() {
    const message = this.cli.error

    if (isEmpty(message)) {
      return null
    }

    for (const payload of cliErrors) {
      if (message.includes(payload.error)) {
        return new AppError(payload.message, {
          title: `Run ${this.id} has failed.`,
          level: payload.level,
          error: new Error(message),
        })
      }
    }

    return new AppError(`DreamPower has been interrupted by an unknown error, this may be caused by a corrupt installation, please check the console for more information.\n<pre>${message}</pre>`, {
      title: `Run ${this.id} has failed.`,
      error: new Error(message),
      terminal: this.cli.lines,
    })
  }

  _sendNotification() {
    const window = activeWindow()

    if (!isNil(window) && window.isFocused()) {
      return
    }

    if (!settings.notifications.run) {
      return
    }

    const notification = new Notification(`📷 ${this.file.fullname} - Run ${this.id} has finished.`)

    /*
    notification.onclick = () => {
      const window = activeWindow()

      if (!isNil(window)) {
        window.focus()
      }

      window.$router.push(`/nudify/${this.photo.id}/results`)
    }
    */
  }
}
