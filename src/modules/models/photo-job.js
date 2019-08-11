import _ from 'lodash'
import moment from 'moment'
import File from '../file'
import Timer from '../timer'
import WebError from '~/modules/web-error'

const debug = require('debug').default('app:modules:models:photo-job')

export default class PhotoJob {
  constructor(id, photo) {
    this.id = id
    this.photo = photo

    this.process = undefined

    // Output file, this is the photo already transformed!
    this.file = File.fromPath(photo.getFolderPath(this.getFileName()))

    // Clean initialization
    this.reset()

    this.debug(`Job created`, {
      id: this.id,
      photo: this.photo,
      file: this.file
    })
  }

  /**
   * Restart the information for a possible remake
   */
  reset() {
    // CLI messages
    this.cli = {
      lines: [],
      error: ''
    }

    this.isLoading = false
    this.hasFailed = false
    this.hasFinished = false

    this.timer = new Timer()
    this.file.remove()
  }

  /**
   *
   * @param {*} message
   * @param  {...any} args
   */
  debug(message, ...args) {
    debug(`[${this.id}] ${message} `, ...args)
  }

  /**
   * The Job has begun
   */
  onStart() {
    this.isLoading = true
    this.timer.start()
  }

  /**
   * The Job has finished successfully
   */
  onFinish() {
    this.isLoading = false
    this.hasFinished = true
    this.timer.stop()
  }

  /**
   * The Job has failed
   */
  onFail() {
    this.isLoading = false
    this.hasFailed = true
    this.timer.stop()
  }

  /**
   * ID. Execution Number
   */
  getId() {
    return this.id
  }

  /**
   *
   */
  getPhoto() {
    return this.photo
  }

  /**
   * Transformed File Name
   */
  getFileName() {
    const now = moment().unix()

    // Original name normalized to avoid problems
    const originalName = _.truncate(
      _.deburr(this.photo.getSourceFile().getName()),
      { length: 30, omission: '' }
    )

    return `${originalName}-${this.id}-${now}-dreamtime.png`
  }

  /**
   *
   */
  getFile() {
    return this.file
  }

  /**
   *
   */
  getCliError() {
    if (_.isNil(this.cli.error) || this.cli.error.length === 0) {
      return { type: 'debug', message: '' }
    }

    const message = this.cli.error

    if (message.includes('Found no NVIDIA driver on your system')) {
      return {
        type: 'debug',
        message:
          "Found no NVIDIA driver on your system. Please check that you have an NVIDIA GPU and installed a driver from [here](http://www.nvidia.com/Download/index.aspx). If you don't have an NVIDIA GPU please change the Device option in Settings to **CPU**."
      }
    }

    if (message.includes('The NVIDIA driver on your system is too old')) {
      return {
        type: 'debug',
        message:
          'The NVIDIA driver installed on your system is too old! Please update the drivers [here](http://www.nvidia.com/Download/index.aspx), if the drivers are up to date then your GPU may not be compatible.'
      }
    }

    if (message.includes('no longer supports this GPU')) {
      return {
        type: 'debug',
        message:
          'We are sorry but your GPU is not powerful enough to run this program. Please change the Device option in Settings to **CPU**.'
      }
    }

    if (message.includes('Buy new RAM!')) {
      return {
        type: 'debug',
        message:
          'Apparently you have run out of RAM on your system! Try a photo of smaller size or free all possible memory of your system.'
      }
    }

    if (message.includes('CUDA out of memory')) {
      return {
        type: 'debug',
        message:
          'Apparently you have run out of RAM on your GPU! Try a photo of smaller size.'
      }
    }

    if (message.includes("codec can't decode byte")) {
      return {
        type: 'debug',
        message:
          'The algorithm had a problem decoding some characters. This is usually caused by being installed in a location with special characters (accents, spaces, etc.). Please reinstall the program in another location.'
      }
    }

    return {
      type: 'error',
      message: `The process has been interrupted by an unknown error, this may be caused by a corrupt installation, please check the console for more information.`
    }
  }

  /**
   *
   */
  cancel() {
    if (!this.isLoading || _.isNil(this.process)) {
      return
    }

    this.process.emit('kill')
  }

  /**
   *
   */
  start() {
    return new Promise((resolve, reject) => {
      const onSpawnError = error => {
        reject(
          new WebError(
            `Unable to start DreamPower!\n
            Could not find the executable to DreamPower, in Settings please make sure that the option "DreamPower Folder" is valid, if you are not a developer make sure that the option "Use Python" is disabled.`,
            error,
            'warning'
          )
        )
      }

      try {
        this.process = $tools.transform(this)
      } catch (error) {
        onSpawnError(error)
        return
      }

      this.process.on('error', error => {
        // Error before starting
        onSpawnError(error)
      })

      this.process.on('stdout', output => {
        // Output generated by the CLI
        output = output
          .toString()
          .trim()
          .split('\n')

        output.forEach(text => {
          this.cli.lines.unshift({
            text,
            css: {}
          })
        })
      })

      this.process.on('stderr', output => {
        // CLI error
        this.cli.lines.unshift({
          text: output,
          css: {
            'text-danger': true
          }
        })

        this.cli.error += `${output}\n`
      })

      this.process.on('ready', code => {
        if (code === 0 || _.isNil(code)) {
          // The process has been completed successfully
          // Update the output file information.
          this.file.update()
          this.process = undefined
          resolve()
        } else {
          this.process = undefined

          const err = this.getCliError()

          reject(
            new WebError(
              `Transformation #${this.id} failed`,
              err.message,
              Error(this.cli.error),
              err.type
            )
          )
        }
      })
    })
  }
}
