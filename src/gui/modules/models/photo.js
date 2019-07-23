import _ from 'lodash'
import uuid from 'uuid/v4'
import moment from 'moment'
import path from 'path'
import File from '../file'
import PhotoJob from './photo-job'

const debug = require('debug').default('app:modules:models:model-photo')

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

    //
    this.outputs = []

    // Source file, this is the photo that we want to transform
    this.sourceFile = file

    // Cropped file, this is the photo cropped to 512x512
    this.croppedFile = File.fromPath(
      path.join($settings.folders.cropped, `${this.uuid}.png`)
    )

    // Transformation Preferences
    this.preferences = _.clone($settings.preferences)

    // Transformation Info
    this.transformation = {
      duration: 0,
      start: undefined
    }

    // CLI messages
    this.cliLines = []
    this.cliError = ''

    this.debug(`New instance of Photo`, {
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

    if (file.size > 5) {
      return 'The selected file is big, this can generate problems. Maximum size: 5MB'
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
    return path.join($settings.folders.models, this.getFolderName(), ...args)
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
    this.transformation.start = moment()

    const durationFunc = () => {
      this.transformation.duration = moment().diff(
        this.transformation.start,
        'seconds'
      )
    }

    const durationInterval = setInterval(durationFunc, 1000)
    durationFunc()

    for (let it = 0; it < this.preferences.executions; it += 1) {
      const job = new PhotoJob(it, this)
      this.outputs.push(job)

      await job.transform()
    }

    clearInterval(durationInterval)
  }
}
