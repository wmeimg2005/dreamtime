// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import { clone, isNil } from 'lodash'
import uuid from 'uuid'
import Queue from 'better-queue'
import MemoryStore from 'better-queue-memory'
import Logger from 'logplease'
import { File } from '../file'
import { Timer } from '../timer'

const { settings } = $provider.services

export class Photo {
  id

  file

  model

  status = 'pending'

  queue

  jobs = []

  preferences = {}

  timer = new Timer()

  _overlay = {
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
  }

  _logger

  /**
   *
   * @param {File} file
   * @param {*} [model]
   */
  constructor(file, model) {
    this.file = file

    this.id = file.md5

    this.preferences = clone(settings.preferences)

    this._logger = Logger.create(`nudify:photo:${this.uuid}`)

    this.validate()

    this._setupJobs()
  }

  validate() {
    const { exists, mimetype, path } = this.file

    if (!exists) {
      throw new AppError(`The file "${path}" does not exists.`, { title: 'Upload failed.', level: 'warn' })
    }

    if (mimetype !== 'image/jpeg' && mimetype !== 'image/png' && mimetype !== 'image/gif') {
      throw new AppError(`The file "${path}" is not a valid photo. Only jpeg, png or gif.`, { title: 'Upload failed.', level: 'warn' })
    }
  }

  _setupJobs() {
    this.jobs = new Queue(this._run, {
      maxTimeout: settings.processing.device === 'GPU' ? (2 * 60 * 1000) : (10 * 60 * 1000),
      maxRetries: 2,
      retryDelay: 1000,
      afterProcessDelay: 1000,
      batchSize: 1,
      store: new MemoryStore(),
    })

    this.jobs.on('drain', () => {
      this._logger.debug('All jobs finished.')
      this._onFinish()
    })

    this.jobs.on('task_started', (jobId, job) => {
      this._logger.debug(`Job #${jobId} has started!`, { job })
      job.onStart()
    })

    this.jobs.on('task_finish', (jobId) => {
      const job = this.getJobById(jobId)

      this._logger.debug(`Job #${jobId} has finished!`, { job })
      job.onFinish()
    })

    this.jobs.on('task_failed', (jobId, error) => {
      const job = this.getJobById(jobId)

      this._logger.warn(`Job #${jobId} has failed!`, { job })
      job.onFail()

      throw error
    })
  }

  _run(job, cb) {

  }

  _onFinish() {

  }
}
