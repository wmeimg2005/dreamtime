import _ from 'lodash'
import { uuid } from 'electron-utils/browser'
import moment from 'moment'
import path from 'path'
import Queue from 'better-queue'
import MemoryStore from 'better-queue-memory'
import File from '../file'
import Timer from '../timer'
import PhotoJob from './photo-job'

const debug = require('debug').default('app:modules:models:photo')

/**
 * Represents the photo to be processed of a Model.
 */
export default class Photo {
  /**
   *
   * @param {Model|null} model Model to which it belongs
   * @param {File} file Instance of the file
   */
  constructor(model, file) {
    // Unique identification and model
    this.uuid = uuid()
    this.model = model

    // Source file, this is the photo that we want to transform
    this.sourceFile = file

    // Cropped file, this is the photo cropped to 512x512
    this.croppedFile = File.fromPath(
      $tools.paths.getCropped(`${this.uuid}.png`)
    )

    //
    this.isLoading = false

    // Transformation Preferences
    this.preferences = _.clone($settings.preferences)

    // Transformation Timers
    this.timer = new Timer()

    //
    this.jobs = []

    // Queue of transformation, one by one.
    this.queue = new Queue(
      async (job, cb) => {
        await job.start()
        cb(null)
      },
      {
        maxRetries: 3,
        retryDelay: 1000,
        maxTimeout:
          $settings.processing.device === 'GPU' ? 60 * 1000 : 300 * 1000,
        afterProcessDelay: 1000,
        store: new MemoryStore()
      }
    )

    this.queue.on('task_started', (jobId, job, stats) => {
      debug(`The Job #${jobId} has begun!`, { job, stats })
      job.onStart()
    })

    this.queue.on('task_finish', (jobId, job, stats) => {
      if (_.isNil(job)) {
        job = this.jobs[jobId - 1]
      }

      debug(`The Job #${jobId} has finished!`, { jobId, job, stats })
      job.onFinish()

      if (this.preferences.executions === jobId) {
        this.onFinish()
      }
    })

    this.queue.on('task_failed', (jobId, job, error, stats) => {
      console.log({
        jobId,
        job,
        error,
        stats
      })
    })

    this.debug(`New Photo instance`, {
      uuid: this.uuid,
      model: this.model,
      sourceFile: this.sourceFile,
      croppedFile: this.croppedFile
    })
  }

  /**
   *
   * @param {*} message
   * @param  {...any} args
   */
  debug(message, ...args) {
    debug(`[${this.uuid}] ${message} `, ...args)
  }

  /**
   *
   */
  onStart() {
    this.isLoading = true
    this.timer.start()
  }

  /**
   *
   */
  onFinish() {
    this.isLoading = false
    this.timer.stop()
  }

  /**
   *
   */
  isValid() {
    return _.isNil(this.getValidationErrorMessage())
  }

  /**
   * Returns the error message for an invalid file. null if there are no errors.
   */
  getValidationErrorMessage() {
    const file = this.getSourceFile()

    if (!file.exists) {
      return 'Apparently the file does not exist anymore!'
    }

    if (
      file.mimetype !== 'image/jpeg' &&
      file.mimetype !== 'image/png' &&
      file.mimetype !== 'image/gif'
    ) {
      return 'The selected file is not a valid photo. Only JPEG, PNG or GIF.'
    }

    return null
  }

  /**
   *
   */
  getFolderName() {
    return _.isNil(this.model) ? 'Uncategorized' : this.model.name
  }

  /**
   *
   */
  getFolderPath(...args) {
    return $tools.paths.getModels(this.getFolderName(), ...args)
  }

  /**
   *
   */
  getPreferences() {
    return this.preferences
  }

  /**
   *
   */
  getSourceFile() {
    return this.sourceFile
  }

  /**
   *
   */
  getCroppedFile() {
    return this.croppedFile
  }

  /**
   *
   */
  async start() {
    debug(
      `Preparing the transformation for ${this.preferences.executions} jobs`
    )

    this.onStart()

    for (let it = 1; it <= this.preferences.executions; it += 1) {
      const job = new PhotoJob(it, this)

      this.jobs.push(job)
      this.queue.push(job)
    }
  }

  remake(id) {
    const job = this.jobs[id - 1]

    if (_.isNil(job)) {
      return
    }

    debug(`Remaking Job #${id}`)

    job.reset()
    this.queue.push(job)
  }
}
