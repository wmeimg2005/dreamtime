// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import {
  isError, isString, isObject, isArray,
} from 'lodash'
import swal from 'sweetalert'

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
    if (!rollbar.enabled) {
      return
    }

    const { level } = this.options

    try {
      const error = this.options.error || this

      const response = rollbar[level](this.message, error, this.options)

      if (response.uuid) {
        this.message += `\n\nShare this with a developer:\nhttps://rollbar.com/occurrence/uuid/?uuid=${response.uuid}`
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

    swal({
      title: this.options.title,
      text: this.message,
      icon,
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

    if (process.env.NODE_ENV !== 'development') {
      this.report()
    }

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
        reportError = JSON.stringify(error)
      } else {
        reportError = new Error(error)
      }

      appError = new AppError(`The application has encountered an unexpected error:\n<code>${reportError ?.message}</code>`,
        {
          error: reportError,
          title: 'Unexpected error!',
        })
    }

    appError.handle()
  }
}
