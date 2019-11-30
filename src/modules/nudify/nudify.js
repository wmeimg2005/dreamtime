// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import {
  startsWith, find, isNil,
  filter, map, debounce,
  remove, clone,
} from 'lodash'
import { join } from 'path'
import Queue from 'better-queue'
import MemoryStore from 'better-queue-memory'
import Swal from 'sweetalert2'
import delay from 'delay'
import { events } from '../events'
import { Photo } from './photo'
import { File } from '../file'
import { getFilesMetadata } from '~/workers/fs'

const logger = require('logplease').create('nudify')

const { settings } = $provider.services
const { existsSync, statSync, readdir } = $provider.tools.fs

const MAX_PHOTOS = 1000
export class Nudify {
  /**
   * @type {Queue}
   */
  static queue

  /**
   * @type {Array<Photo>}
   */
  static photos = []

  /**
   * @type {Function}
   */
  static emitUpdate = debounce(() => {
    events.emit('nudify.update')
  }, 300, { leading: true })

  /**
   * @type {Array<Photo>}
   */
  static get waiting() {
    return filter(this.photos, (photo) => photo.status === 'waiting' || photo.status === 'running')
  }

  /**
   * @type {Array<Photo>}
   */
  static get pending() {
    return filter(this.photos, { status: 'pending' })
  }

  /**
   * @type {Array<Photo>}
   */
  static get finished() {
    return filter(this.photos, { status: 'finished' })
  }

  /**
   *
   */
  static setup() {
    this.queue = new Queue(this._run, {
      maxTimeout: (60 * 60 * 1000),
      afterProcessDelay: 500,
      batchSize: 1,
      concurrent: 1,
      store: new MemoryStore(),
    })

    this.queue.on('task_queued', (photoId, photo) => {
      // eslint-disable-next-line no-param-reassign
      photo.status = 'waiting'
    })
  }

  /**
   *
   * @param {Photo} photo
   * @param {Function} cb
   */
  static _run(photo, cb) {
    try {
      photo.start().then(() => {
        cb()
        return true
      }).catch((error) => {
        cb(error)
      })
    } catch (error) {
      cb(error)
    }

    return {
      cancel() {
        photo.cancel('pending')
      },
    }
  }

  /**
   *
   * @param {string} id
   */
  static getPhoto(id) {
    return find(this.photos, { id })
  }

  /**
   *
   * @param {File} input
   */
  static add(file) {
    const photo = new Photo(file)

    const exists = find(this.photos, ['id', photo.id])

    if (!isNil(exists)) {
      return
    }

    this.photos.unshift(photo)

    logger.debug('Photo added!', photo.file.fullname)
    this.emitUpdate()

    if (this.photos.length > MAX_PHOTOS) {
      // release the oldest photo
      this.photos.pop()
    }

    const { uploadMode } = settings.app

    if (uploadMode === 'add-queue') {
      this.addToQueue(photo)
    } else if (uploadMode === 'go-preferences') {
      window.$router.push(`/nudify/${photo.id}`)
    }
  }

  /**
   *
   * @param {string} filepath
   */
  static async addFile(filepath, skipErrors = false) {
    const filesMetadata = await getFilesMetadata(filepath)

    filesMetadata.forEach((metadata) => {
      const file = File.fromMetadata(metadata)

      try {
        this.add(file)
      } catch (err) {
        if (skipErrors) {
          logger.warn('Error adding a photo, skipped.', err)
        } else {
          throw err
        }
      }
    })
  }

  /**
   *
   * @param {string} paths
   */
  static addFiles(paths) {
    const promises = []

    for (const path of paths) {
      promises.push(this.addFile(path, true))
    }

    return Promise.all(promises)
  }

  /**
   *
   * @param {string} url
   */
  static async addUrl(url) {
    if (!startsWith(url, 'http://') && !startsWith(url, 'https://')) {
      throw new AppError('Please enter a valid web address.', { title: 'Upload failed.', level: 'warning' })
    }

    Swal.fire({
      title: 'Downloading...',
      text: 'One moment, please.',
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
    })

    try {
      const file = await File.fromUrl(url)

      Swal.close()

      this.add(file)
    } catch (error) {
      throw new AppError('There was a problem trying to download the file. Make sure you have an Internet connection.', { title: 'Upload failed.', level: 'warning', error })
    }
  }

  /**
   *
   * @param {Photo} photo
   */
  static addToQueue(photo) {
    this.queue.push(photo)
  }

  /**
   *
   * @param {Photo} photo
   */
  static removeFromQueue(photo) {
    photo.cancel('pending')
    this.queue.cancel(photo.id)
  }

  /**
   *
   * @param {Photo} photo
   */
  static forget(photo) {
    this.removeFromQueue(photo)

    // eslint-disable-next-line lodash/prefer-immutable-method
    remove(this.photos, { id: photo.id })

    this.emitUpdate()
  }

  /**
   *
   * @param {string} status
   */
  static startAll(status = 'pending') {
    this.photos.forEach((photo) => {
      if (photo.status !== status) {
        return
      }

      this.addToQueue(photo)
    })
  }

  /**
   *
   * @param {string} status
   */
  static stopAll(status = 'pending') {
    this.photos.forEach((photo) => {
      if (photo.status !== status) {
        return
      }

      this.removeFromQueue(photo)
    })
  }

  static async forgetAll(status = 'pending') {
    const response = await Swal.fire({
      title: 'Are you sure?',
      text: 'Forgetting will remove all photos from the queue (it will not delete the files) and free up memory.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#F44336',
      confirmButtonText: 'Yes, forget it!',
    })

    if (!response.value) {
      return
    }

    const photosCopy = clone(this.photos)

    photosCopy.forEach((photo) => {
      if (photo.status !== status) {
        return
      }

      logger.debug(`Forgetting ${photo.file.fullname}...`)

      this.forget(photo)
    })
  }
}

window.Nudify = Nudify // debugging
