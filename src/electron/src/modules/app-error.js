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
import { app, dialog } from 'electron'

const logger = require('logplease').create('app-error:main')

/**
 * @typedef {Object} ErrorOptions
 * @property {string} title
 * @property {string} level
 * @property {Error} error
 * @property {boolean} fatal
 * @property {boolean} quiet
 */

/**
 * @global
 */
export class AppError extends Error {
  /**
   * @type {ErrorOptions}
   */
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

  show() {
    dialog.showErrorBox(
      this.options.title || 'A problem has occurred.',
      this.message,
    )
  }

  handle() {
    const {
      level, quiet, fatal, error,
    } = this.options

    // logger
    logger[level](this.message, {
      error,
    })

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

      appError = new AppError(`The application has encountered an unexpected error:\n<code>${reportError?.message}</code>`,
        {
          error: reportError,
          title: 'Unexpected error!',
        })
    }

    appError.handle()
  }
}
