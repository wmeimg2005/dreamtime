import _ from 'lodash'
import uuid from 'uuid/v4'
import moment from 'moment'
import path from 'path'
import File from '../file'

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
  getOutputFile() {
    return this.outputFile
  }

  /**
   *
   * @param {object} settings
   */
  transform(settings) {
    return new Promise((resolve, reject) => {
      this.transformation.start = moment()

      const durationFunc = () => {
        this.transformation.duration = moment().diff(
          this.transformation.start,
          'seconds'
        )
      }

      const onSpawnError = error => {
        reject(
          new Error(
            `We were unable to start the CLI for the transformation!\n
        This can be caused by a corrupt installation, please make sure that cli.exe exists and works correctly (if you are a developer, make sure that main.py works)\n
        The script has reported the following error, take a screenshot to get more information:\n
        ${error}`
          )
        )
      }

      const durationInterval = setInterval(durationFunc, 1000)
      durationFunc()

      let child

      try {
        child = window.deepTools.transform(this, settings)
      } catch (error) {
        clearInterval(durationInterval)
        onSpawnError(error)
        return
      }

      child.on('error', error => {
        onSpawnError(error)
      })

      child.on('stdout', output => {
        this.cliLines.push(
          ...output
            .toString()
            .trim()
            .split('\n')
        )
      })

      child.on('stderr', output => {
        this.cliLines.push(output)
        this.cliError += `${output}\n`
      })

      child.on('ready', code => {
        clearInterval(durationInterval)

        if (code === 0) {
          this.outputFile.update()
          resolve()
        } else {
          reject(
            new Error(
              `The transformation has been interrupted by an CLI error.\n
              This can be caused by:\n
              - A corrupt installation (commonly: The checkpoints folder was not found in cli/)\n
              - Incompatible system\n
              - If you are using GPU: The NVIDIA graphics card could not be found\n
              - If you are using CPU: Insufficient RAM. Buy more RAM!\n
              The CLI has reported the following error, take a screenshot to get more information:\n
              ${this.cliError}`
            )
          )

          this.cliLines = []
          this.cliError = ''
        }
      })
    })
  }
}
