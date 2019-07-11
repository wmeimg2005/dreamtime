import _ from 'lodash'
import uuid from 'uuid/v4'

const debug = require('debug').default('app:modules:models:model-photo')

export default class ModelPhoto {
  constructor(model, filePath) {
    this.model = model
    this.uuid = uuid()
    this.sourceFilePath = filePath
    this.croppedFilePath = undefined
    this.outputFilePath = undefined

    this.cliLines = []
    this.cliError = ''

    this.debug(`New instance of ModelPhoto for: ${filePath}`)
  }

  debug(message, ...args) {
    debug(`[${this.uuid}] ${message} `, ...args)
  }

  isValid() {
    return _.isNil(this.getValidationErrorMessage())
  }

  getFolderName() {
    return _.isNil(this.model) ? 'Uncategorized' : this.model.name
  }

  getFolderPath() {
    return window.deepTools.getPath('userData', 'models', this.getFolderName())
  }

  getStoragePath(...args) {
    return window.deepTools.getPath(
      'userData',
      'models',
      this.getFolderName(),
      ...args
    )
  }

  getValidationErrorMessage() {
    return window.deepTools.getValidationErrorMessage(this.sourceFilePath)
  }

  getSourceAsDataURL() {
    return window.deepTools.getFileAsDataURL(this.sourceFilePath)
  }

  getCroppedFilePath() {
    return (
      this.croppedFilePath ||
      window.deepTools.getPath('temp', `${this.uuid}.png`)
    )
  }

  getCroppedAsDataURL() {
    return window.deepTools.getFileAsDataURL(this.croppedFilePath)
  }

  hasCroppedPhoto() {
    return !_.isNil(this.croppedFilePath)
  }

  getOutputFilePath() {
    return (
      this.outputFilePath ||
      window.deepTools.getPath(
        'userData',
        'models',
        'Uncategorized',
        `${this.uuid}.png`
      )
    )
  }

  getOutputAsDataURL() {
    return window.deepTools.getFileAsDataURL(this.outputFilePath)
  }

  hasOutputPhoto() {
    return !_.isNil(this.outputFilePath)
  }

  saveCroppedPhoto(dataURL) {
    const filePath = this.getCroppedFilePath()

    this.debug(`Saving a resized photo in: ${filePath}`)

    window.deepTools.saveDataURLFile(dataURL, filePath)

    this.debug(`Resized photo saved successfully!`)

    this.croppedFilePath = filePath
  }

  transform(useGpus = false, useWaifu = false) {
    return new Promise((resolve, reject) => {
      const child = window.deepTools.transform(this, useGpus, useWaifu)

      child.on('stdout', output => {
        this.cliLines.push(output)
      })

      child.on('stderr', output => {
        this.cliLines.push(output)
        this.cliError += `${output}\n`
      })

      child.on('ready', code => {
        if (code === 0) {
          this.outputFilePath = this.getOutputFilePath()
          resolve()
        } else {
          reject(
            new Error(
              `A problem has occurred, the transformation has been interrupted by an CLI error.\n
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
