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
  filter, map,
} from 'lodash'
import { join } from 'path'
import Queue from 'better-queue'
import MemoryStore from 'better-queue-memory'
import swal from 'sweetalert'
import PQueue from 'p-queue'
import { events } from '../events'
import { Photo } from './photo'
import { File } from '../file'

const logger = require('logplease').create('nudify')

const { existsSync, statSync, readdir } = $provider.tools.fs

const MAX_PHOTOS = 100

export class Nudify {
  static queue

  static photos = []

  static get running() {
    return filter(this.photos, { status: 'running' })
  }

  static get pending() {
    return filter(this.photos, { status: 'pending' })
  }

  static get done() {
    return filter(this.photos, { status: 'done' })
  }

  static setup() {
    this.queue = new Queue(this._run, {
      batchSize: 1,
      store: new MemoryStore(),
    })
  }

  static _run(photo, cb) {

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

    logger.debug('Photo added!', photo.file.path)
    events.emit('nudify.add', null, photo)

    if (this.photos.length > MAX_PHOTOS) {
      // performance!
      this.photos.pop()
    }
  }

  static async addFile(path) {
    if (!existsSync(path)) {
      throw new AppError('The path does not exist.', { title: 'Upload failed.', level: 'warn' })
    }

    const stat = statSync(path)

    if (stat.isDirectory()) {
      const paths = map(await readdir(path), (fpath) => join(path, fpath))
      await this.addFiles(paths)
      return
    }

    const file = File.fromPath(path)
    this.add(file)
  }

  static addFiles(paths) {
    const promises = []

    for (const path of paths) {
      promises.push(this.addFile(path))
    }

    return Promise.all(promises)
  }

  static async addUrl(url) {
    if (!startsWith(url, 'http://') && !startsWith(url, 'https://')) {
      throw new AppError('Please enter a valid web address.', { title: 'Upload failed.', level: 'warning' })
    }

    swal({
      title: 'Downloading...',
      text: 'One moment, please.',
      button: false,
      closeOnClickOutside: false,
      closeOnEsc: false,
    })

    try {
      const file = await File.fromUrl(url)

      swal.close()

      this.add(file)
    } catch (error) {
      throw new AppError('There was a problem trying to download the file. Make sure you have an Internet connection.', { title: 'Upload failed.', level: 'warning', error })
    }
  }

  static getPhoto(id) {
    return find(this.photos, { id })
  }
}

window.Nudify = Nudify

/*
export default {
  init() {
    this.reset()
  },

  reset() {
    this.model = undefined
    this.photo = undefined
  },

  getModel() {
    return this.model
  },


  setModel(value) {
    this.model = value
    return this
  },

  getPhoto() {
    return this.photo
  },

  setPhoto(value) {
    this.photo = value
  },

  hasPhoto() {
    return !_.isNil(this.photo)
  },

  start(photo, model = null) {
    this.setModel(model)
    this.setPhoto(photo)
  },
}
*/
