// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import {
  cloneDeep, isNil, merge, isError,
} from 'lodash'
import { Queue } from '@dreamnet/queue'
import EventBus from 'js-event-bus'
import { settings } from '../system'
import { Consola, handleError } from '../consola'
import { NudifyQueue } from './queue'
import { Nudify } from './nudify'
import { PhotoRun } from './photo-run'
import { File } from '../file'
import { Timer } from '../timer'
import { events } from '../events'

const { getCurrentWindow } = require('electron').remote

const { getModelsPath, getCropPath } = $provider.paths

export class Photo {
  /**
   * @type {string}
   */
  id

  /**
   * @type {File}
   */
  file

  /**
   * @type {File}
   */
  fileEditor

  /**
   * @type {File}
   */
  fileCrop

  /**
   * @type {EventBus}
   */
  events = new EventBus

  /**
   * @type {string}
   */
  model

  /**
   * @type {string}
   */
  _status = 'pending'

  get status() {
    return this._status
  }

  set status(value) {
    this._status = value
    events.emit('nudify.update')
  }

  /**
   * @type {Queue}
   */
  queue

  /**
   * @type {Array}
   */
  runs = []

  /**
   * @type {Object}
   */
  preferences = {}

  /**
   * @type {Timer}
   */
  timer = new Timer

  /**
   * @type {boolean}
   */
  isMaskfin = false

  /**
   * @type {require('cropperjs').default}
   */
  cropper

  /**
   * @type {require('tui-image-editor').default}
   */
  editor

  /**
   * @type {Object}
   */
  cropData

  /**
   * @type {Object}
   * @property {number} startX
   * @property {number} startY
   * @property {number} endX
   * @property {number} endY
   */
  overlay

  /**
   * @type {Consola}
   */
  consola

  get folderName() {
    // todo: implement models
    return 'Uncategorized'
  }

  get running() {
    return this.status === 'running'
  }

  get finished() {
    return this.status === 'finished'
  }

  get pending() {
    return this.status === 'pending'
  }

  get waiting() {
    return this.status === 'waiting'
  }

  get started() {
    return this.running || this.finished
  }

  get canModify() {
    return this.file.mimetype !== 'image/gif'
  }

  get scaleMode() {
    const { scaleMode } = this.preferences.advanced

    if (scaleMode === 'cropjs') {
      if (!this.canModify) {
        this.consola.debug('Wanted to use the cropper but we cannot modify.')
        return 'auto-resize'
      }

      if (!this.fileCrop.exists) {
        this.consola.debug('Wanted to use the cropper but the file does not exist.')

        // The Cropper has not been used.
        return 'auto-resize'
      }
    }

    if (scaleMode === 'overlay' && isNil(this.overlay)) {
      // The Cropper has not been used.
      return 'auto-resize'
    }

    return scaleMode
  }

  /**
   * Final file to process.
   *
   * @type {File}
   */
  get fileFinal() {
    if (this.scaleMode === 'cropjs') {
      return this.fileCrop
    }

    if (this.canModify && this.fileEditor.exists) {
      return this.fileEditor
    }

    return this.file
  }

  /**
   * File for the croppper.
   *
   * @type {File}
   */
  get fileInput() {
    if (this.fileEditor.exists) {
      return this.fileEditor
    }

    return this.file
  }

  /**
   *
   * @param {File} file
   * @param {*} [model]
   */
  // eslint-disable-next-line no-unused-vars
  constructor(file, { isMaskfin = false, model = null } = {}) {
    this.id = file.md5

    this.file = file

    this.fileEditor = new File(getCropPath(`${this.id}-editor${file.extension}`), true)

    this.fileCrop = new File(getCropPath(`${this.id}-crop${file.extension}`), true)

    this.consola = Consola.create(file.fullname)

    this.isMaskfin = isMaskfin

    this.setup()
  }

  /**
   *
   */
  async syncEditor() {
    if (isNil(this.editor)) {
      return
    }

    const dataURL = this.editor.toDataURL({
      format: this.file.extension.substring(1),
      quality: 1,
      multiplier: 1,
    })

    await this.fileEditor.writeDataURL(dataURL)
    this.consola.debug(`Saved editor changes.`)
  }

  /**
   *
   */
  async syncCrop() {
    if (isNil(this.cropper)) {
      return
    }

    const canvas = this.cropper.getCroppedCanvas({
      width: 512,
      height: 512,
      minWidth: 512,
      minHeight: 512,
      maxWidth: 512,
      maxHeight: 512,
      fillColor: 'white',
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high',
    })

    const dataURL = canvas.toDataURL(this.fileCrop.mimetype, 1)
    await this.fileCrop.writeDataURL(dataURL)

    this.consola.debug(`Saved crop changes.`)
  }

  /**
   *
   * @param  {...any} args
   */
  getFolderPath(...args) {
    return getModelsPath(this.folderName, ...args)
  }

  /**
   *
   */
  setup() {
    this.validate()

    this.setupPreferences()

    this.setupQueue()
  }

  /**
   *
   */
  validate() {
    const { exists, mimetype, path } = this.file

    if (!exists) {
      throw new Warning('Upload failed.', `The file "${path}" does not exists.`)
    }

    if (mimetype !== 'image/jpeg' && mimetype !== 'image/png' && mimetype !== 'image/gif') {
      throw new Warning('Upload failed.', `The file "${path}" is not a valid photo. Only jpeg, png or gif.`)
    }
  }

  /**
   *
   */
  setupPreferences() {
    this.preferences = cloneDeep(settings.payload.preferences)
    let forcedPreferences = {}

    if (this.isMaskfin) {
      forcedPreferences = {
        body: {
          executions: 1,
          randomize: false,
          progressive: {
            enabled: false,
          },
        },
        advanced: {
          scaleMode: 'auto-rescale',
          transformMode: 'import-maskfin',
          useColorTransfer: false,
        },
      }
    } else if (!this.canModify) {
      forcedPreferences = {
        advanced: {
          transformMode: 'normal',
        },
      }
    }

    this.preferences = merge(this.preferences, forcedPreferences)
  }

  /**
   *
   */
  setupQueue() {
    /*
    let maxTimeout = settings.processing.device === 'GPU' ? (3 * 60 * 1000) : (20 * 60 * 1000)

    if (this.file.mimetype === 'image/gif') {
      maxTimeout += (30 * 60 * 1000)
    }
    */

    this.queue = new Queue(this.worker)

    this.queue.on('finished', () => {
      if (this.runs.length === 0) {
        this.status = 'pending'
      } else {
        this.onFinish()
      }

      this.consola.debug('🏁 Runs finished. 🏁')
    })

    this.queue.on('task_added', (run) => {
      run.onQueue()

      this.onQueueRun()

      this.consola.debug(`📷 Run added: #${run.id}`)
    })

    this.queue.on('task_started', (run) => {
      run.onStart()

      this.consola.debug(`🚗 Run started: #${run.id}`)
    })

    this.queue.on('task_finished', (run) => {
      run.onFinish()

      this.consola.debug(`🏁 Run finished: #${run.id}`)
    })

    this.queue.on('task_failed', (run, error) => {
      run.onFail()

      this.consola.warn(`💥 Run failed: #${run.id} ${error}`)

      if (isError(error)) {
        handleError(error)
      }
    })

    this.queue.on('task_dropped', (run) => {
      run.stop()
      run.onFinish()

      this.consola.debug(`⛔ Run dropped: ${run.id}`)
    })
  }

  /**
   *
   * @param {*} id
   */
  getRunById(id) {
    return this.runs[id - 1]
  }

  /**
   * Add this photo to the queue (time to nudify)
   */
  add() {
    NudifyQueue.add(this)
  }

  /**
   * Cancel the photo runs and remove it from the queue.
   */
  cancel() {
    NudifyQueue.cancel(this)
  }

  /**
   * Remove the photo from the application.
   */
  forget() {
    Nudify.forget(this)
  }

  /**
   * Nudification start.
   * This should only be called from the queue.
   */
  async start() {
    const { executions } = this.preferences.body

    if (executions === 0) {
      return
    }

    await this.syncEditor()
    await this.syncCrop()

    // this.onStart()

    for (let it = 1; it <= executions; it += 1) {
      const run = new PhotoRun(it, this)

      this.runs.push(run)
      this.queue.add(run)
    }

    await new Promise((resolve) => {
      this.queue.on('finished', () => {
        resolve()
      })
    })
  }

  /**
   * Cancel the photo runs.
   * This should only be called from the queue.
   */
  stop() {
    this.queue.clear()
  }

  /**
   *
   * @param {PhotoRun} run
   */
  addRun(run) {
    this.queue.add(run)
  }

  /**
   *
   * @param {PhotoRun} run
   */
  cancelRun(run) {
    this.queue.drop(run)
  }

  /**
   *
   * @param {PhotoRun} run
   */
  worker(run) {
    return run.start()
  }

  /**
   *
   */
  onQueue() {
    this.runs = []

    this.status = 'waiting'
  }

  /**
   *
   */
  onStart() {
    this.timer.start()

    this.status = 'running'

    this.events.emit('start')
  }

  /**
   *
   */
  onQueueRun() {
    this.timer.start()

    this.status = 'running'
  }

  /**
   *
   */
  onFinish() {
    this.timer.stop()
    this.status = 'finished'

    this.sendNotification()

    this.events.emit('finish')
  }

  /**
   *
   */
  sendNotification() {
    if (!settings.notifications.allRuns) {
      return
    }

    try {
      const browserWindow = getCurrentWindow()

      if (isNil(browserWindow) || !browserWindow.isMinimized()) {
        return
      }

      const notification = new Notification(`💖 Dream fulfilled!`, {
        icon: this.file.path,
        body: 'All runs have finished.',
      })

      notification.onclick = () => {
        browserWindow.focus()
        window.$redirect(`/nudify/${this.id}/results`)
      }
    } catch (error) {
      this.photo.consola.warn('Unable to send a notification.', error).report()
    }
  }
}
