// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import {
  isError, isString, isObject, isArray, attempt,
} from 'lodash'
import { mapStackTrace } from 'sourcemapped-stacktrace'
import Swal from 'sweetalert2'
import { logrocket, rollbar } from '~/modules/services'

const logger = require('logplease').create('error:renderer')

const { app } = $provider.api

/**
 * @typedef {Object} ErrorOptions
 * @property {string} title
 * @property {string} level
 * @property {Error} error
 * @property {boolean} fatal
 * @property {boolean} quiet
 */

export class AppError extends Error {
  /**
   * @type {ErrorOptions}
   */
  options = {
    title: null,
    message: null,
    level: 'error',
    error: null,
    fatal: false,
    quiet: false,
  }

  /**
   * @type {boolean}
   */
  reported = false

  /**
   *
   * @param {string} message
   * @param {ErrorOptions} options
   */
  constructor(message, options = {}) {
    if (isError(message)) {
      // that's better.
      options.error = message
      message = message.message
    }

    const { error } = options

    if (isError(error)) {
      // we want this error to be the closest to the original
      super(error.message)

      if (error.options) {
        // inherit error options.
        this.options = error.options
      }
    } else if (isString(message)) {
      super(message)
    } else {
      super()
    }

    this.options = {
      ...this.options,
      ...options,
      message,
    }

    if (this.options.level === 'warning') {
      // warning does not exist in logger.
      this.options.level = 'warn'
    }
  }

  /**
   * Copy the original error information.
   */
  async copyError() {
    const { error } = this.options

    if (!isError(error)) {
      return
    }

    // transform the original stack to the source-map stack.
    const getStack = () => new Promise((resolve) => {
      mapStackTrace(error.stack, (stack) => {
        resolve(`${error.message}\n${stack.join('\n')}`)
      }, { cacheGlobally: true })
    })

    // copy pasta
    this.name = error.name
    this.stack = await getStack()
  }

  /**
   * Report the error to the logger, bug and session tracking services.
   */
  report() {
    const { level, error } = this.options
    let rollbarResponse

    // logger.
    logger[level](this)

    // bug tracking.
    if (rollbar.enabled && level === 'error') {
      try {
        rollbarResponse = rollbar[level](this, {
          ...this.options,
          sessionURL: logrocket.sessionURL,
        })

        this.reported = true
      } catch (err) {
        logger.warn('Rollbar report fail!', err)
      }
    }

    // session tracking.
    if (logrocket.enabled && level === 'error') {
      try {
        logrocket.captureException(error || this, {
          extra: {
            ...this.options,
            rollbarURL: `https://rollbar.com/occurrence/uuid/?uuid=${rollbarResponse?.uuid}`,
          },
        })

        this.reported = true
      } catch (err) {
        logger.warn('LogRocket report fail!', err)
      }
    }
  }

  /**
   * Show the error to the user.
   */
  show() {
    let icon = 'error'

    if (this.level === 'warning' || this.level === 'warn') {
      icon = 'warning'
    }

    if (this.level === 'info') {
      icon = 'info'
    }

    Swal.fire({
      title: this.options.title,
      html: `${this.options.message}<br><br><pre>${this.message}</pre>`,
      icon,
      footer: this.reported ? `<code>🐞 This problem has been reported to DreamNet.<br>It will be fixed as soon as possible.</code>` : null,
    })
  }

  /**
   *
   */
  async handle() {
    const { quiet, fatal, error } = this.options

    await this.copyError(error)

    attempt(() => {
      this.report()

      if (!quiet) {
        this.show()
      }
    })

    if (fatal) {
      app.quit()
    }
  }

  /**
   *
   */
  static handle(error) {
    let appError = error

    if (!(error instanceof AppError)) {
      let exception

      if (isError(error)) {
        exception = error
      } else if (isObject(error) || isArray(error)) {
        exception = new Error(JSON.stringify(error))
      } else {
        exception = new Error(error)
      }

      appError = new AppError(`Woah! An error has occurred and we do not know why.<br>Please try again.`, {
        error: exception,
        title: 'Unexpected error!',
      })
    }

    appError.handle()
  }
}
