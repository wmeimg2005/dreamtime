import _ from 'lodash'
import uuid from 'uuid'
import swal from 'sweetalert'
import Queue from 'better-queue'
import MemoryStore from 'better-queue-memory'
import Timer from '../timer'
import PhotoJob from './photo-job'
import WebError from '../web-error'

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
    // unique identification and model
    this.uuid = uuid()
    this.model = model

    this.started = false
    this.running = false

    // photo file
    this.file = file

    this.crop = {
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
    }

    // preferences
    this.preferences = _.clone($settings.preferences)

    // reset data
    this.reset()

    // jobs queue
    this.queue = new Queue(
      (job, cb) => {
        job
          .start()
          .then(() => {
            // eslint-disable-next-line promise/no-callback-in-promise
            cb(null)
            return true
          })
          .catch((err) => {
            // eslint-disable-next-line promise/no-callback-in-promise
            cb(err)
          })

        return {
          cancel: () => {
            job.cancel()
          },
        }
      },
      {
        maxRetries: 2,
        retryDelay: 1000,
        maxTimeout:
          $settings.processing.device === 'GPU' ? 60 * 1000 : 300 * 1000,
        afterProcessDelay: 1000,
        batchSize: 1,
        store: new MemoryStore(),
      },
    )

    this.queue.on('drain', () => {
      debug('All Jobs have finished!')
      this.onFinish()
    })

    this.queue.on('task_started', (jobId, job) => {
      debug(`The Job #${jobId} has begun!`, { job })
      job.onStart()
    })

    this.queue.on('task_finish', (jobId, job, stats) => {
      if (_.isNil(job)) {
        job = this.getJobById(jobId)
      }

      debug(`The Job #${jobId} has finished!`, { jobId, job, stats })
      job.onFinish()
    })

    this.queue.on('task_failed', (jobId, error, payload) => {
      const job = this.getJobById(jobId)

      console.warn(`The Job #${jobId} has failed!`, { error, payload })
      job.onFail()

      if (_.isError(error)) {
        if (error instanceof WebError) {
          error.report()
        } else {
          throw error
        }
      }
    })
  }

  reset() {
    //
    this.running = false

    // timer
    this.timer = new Timer()

    //
    this.jobs = []
  }

  /**
   *
   * @param {*} message
   * @param  {...any} args
   */
  debug(message, ...args) {
    debug(`${message} `, ...args)
  }

  /**
   * The Photo transformation has begun
   */
  onStart() {
    if (this.running) {
      return
    }

    this.started = true
    this.running = true
    this.timer.start()
  }

  /**
   * The Photo transformation has finished
   */
  onFinish() {
    if (!this.running) {
      return
    }

    this.running = false
    this.timer.stop()

    const activeWindow = $tools.utils.activeWindow()

    if (!activeWindow.isFocused() && $settings.notifications.allRuns) {
      const notification = new Notification(`💭 All runs have finished.`, {
        body: 'Now you can save all the dreams you like.',
      })

      notification.onclick = () => {
        activeWindow.focus()
      }
    }
  }

  /**
   * Returns if the photo is valid
   */
  isValid() {
    return _.isNil(this.getValidationErrorMessage())
  }

  /**
   * Returns the error message for an invalid file. null if there are no errors.
   */
  getValidationErrorMessage() {
    const { file } = this

    if (!file.exists) {
      return 'Apparently the file does not exist anymore!'
    }

    if (
      file.mimetype !== 'image/jpeg'
      && file.mimetype !== 'image/png'
      && file.mimetype !== 'image/gif'
    ) {
      return 'The selected file is not a valid photo. Only JPEG, PNG or GIF.'
    }

    return null
  }

  /**
   * Returns the name of the model folder where it will be saved
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
   * @param {*} id
   */
  getJobById(id) {
    return this.jobs[id - 1]
  }

  /**
   * Start the transformation process!
   */
  async start() {
    if (this.preferences.body.executions === 0) {
      swal('Invalid preferences', 'Please set 1 or more runs', 'error')
      return
    }

    this.reset()

    debug(
      `Preparing the transformation for ${this.preferences.body.executions} jobs`,
    )

    this.onStart()

    for (let it = 1; it <= this.preferences.body.executions; it += 1) {
      const job = new PhotoJob(it, this)

      this.jobs.push(job)
      this.queue.push(job)
    }
  }

  /**
   *
   */
  cancel() {
    if (!this.running) {
      return
    }

    this.jobs.forEach((job) => {
      this.queue.cancel(job.id)
    })

    this.onFinish()
  }

  /**
   * Rerun the indicated Job
   */
  rerunJob(id) {
    const job = this.getJobById(id)

    if (_.isNil(job)) {
      return
    }

    debug(`Remaking Job #${id}`)

    job.reset()
    this.onStart()

    this.queue.push(job)
  }
}
