// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import {
  isError, isString, isObject, isArray, pick,
} from 'lodash'
import Swal from 'sweetalert2'

const logger = require('logplease').create('app-error:renderer')

const { rollbar } = $provider.services
const { app } = $provider.api

/**
 * @typedef {Object} ErrorOptions
 * @property {string} title
 * @property {Error} error
 * @property {string} level
 * @property {Object} extra
 */

export class AppError extends Error {
  options = {
    title: null,
    level: 'error',
    error: null,
    fatal: false,
    quiet: false,
  }

  reportUrl

  /**
   *
   * @param {string} message
   * @param {ErrorOptions} options
   */
  constructor(input, options = {}) {
    if (isString(input)) {
      super(input)
    } else if (isError(input)) {
      super(input.message)

      this.stack = input.stack

      this.options.error = input

      if (input.options) {
        this.options = {
          ...this.options,
          ...input.options,
        }
      }
    } else {
      super()
    }

    this.options = {
      ...this.options,
      ...options,
    }

    if (this.options.level === 'warning') {
      this.options.level = 'warn'
    }
  }

  report() {
    /*
    if (process.env.NODE_ENV === 'development') {
      this.reportUrl = `https://rollbar.com/occurrence/uuid/?uuid={EXAMPLE}`
      return
    }
    */

    const { level } = this.options

    if (!rollbar.enabled || level !== 'error') {
      return
    }

    try {
      const error = this.options.error || this

      const response = rollbar[level](error.message, {
        ...this.options,
        message: this.message,
        error: pick(error, 'message', 'name', 'filename', 'line', 'column', 'stack'),
      })

      if (response.uuid) {
        this.reportUrl = `https://rollbar.com/occurrence/uuid/?uuid=${response.uuid}`
      }
    } catch (err) {
      logger.warn('Error report fail!', err)
    }
  }

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
      html: this.message,
      icon,
      footer: this.reportUrl ? `<code>Share this to a developer: ${this.reportUrl}</code>` : null,
    })
  }

  handle() {
    const {
      level, quiet, fatal, error,
    } = this.options

    // logger
    logger[level](this.message, {
      error,
    })

    this.report()

    if (!quiet) {
      this.show()
    }

    if (fatal) {
      app.quit()
    }
  }

  static handle(error) {
    let appError = error

    if (!(error instanceof AppError)) {
      let reportError

      if (isError(error)) {
        reportError = error
      } else if (isObject(error) || isArray(error)) {
        reportError = new Error(JSON.stringify(error))
      } else {
        reportError = new Error(error)
      }

      appError = new AppError(`The application has encountered an unexpected error:\n<pre>${reportError?.message}</pre>`,
        {
          error: reportError,
          title: 'Unexpected error!',
        })
    }

    appError.handle()
  }
}
