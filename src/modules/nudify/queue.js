// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2020.

import { isError } from 'lodash'
import Queue from 'better-queue'
import MemoryStore from 'better-queue-memory'
import { Consola, handleError } from '../consola'

const consola = Consola.create('queue')

/**
 *
 */
export const NudifyQueue = {
  /**
   * Queue. Photos that are waiting transformation.
   * @type {Queue}
   */
  queue: null,

  /**
   *
   */
  setup() {
    this.queue = new Queue(this.queueTicket, {
      maxTimeout: (3 * 60 * 60 * 1000), // 3 hours.
      afterProcessDelay: 1000,
      batchSize: 1,
      concurrent: 1,
      store: new MemoryStore,
    })

    const { Nudify } = require('./nudify')

    this.queue.on('task_queued', (photoId) => {
      const photo = Nudify.getPhotoById(photoId)
      photo.onQueue()

      consola.debug(`Photo added: ${photoId}`)
    })

    this.queue.on('task_started', (photoId) => {
      const photo = Nudify.getPhotoById(photoId)
      photo.onStart()

      consola.debug(`Photo started: #${photoId}`)
    })

    this.queue.on('task_finish', (photoId) => {
      // const photo = Nudify.getPhotoById(photoId)
      // photo.onFinish()

      consola.debug(`Photo transformed: ${photoId}`)
    })

    this.queue.on('task_failed', (photoId, error) => {
      const photo = Nudify.getPhotoById(photoId)
      photo.onFinish()

      consola.debug(`Photo failed: ${photoId} ${error}`)

      if (isError(error)) {
        handleError(error)
      }
    })
  },

  /**
   *
   * @param {Photo} photo
   * @param {Function} done
   */
  queueTicket(photo, done) {
    photo.start().then(() => {
      done()
      return true
    }).catch((error) => {
      done(error)
    })

    return {
      cancel() {
        photo.stop()
      },
    }
  },

  /**
   *
   * @param {Photo} photo
   */
  add(photo) {
    this.queue.push(photo)
  },

  /**
   *
   * @param {Photo} photo
   */
  cancel(photo) {
    this.queue.cancel(photo.id)
  },
}
