// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import { isError, isString } from 'lodash'
import { app, dialog } from 'electron'
import { rollbar } from './services/rollbar'

const logger = require('logplease').create('electron:scripts:error')

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
    error: null,
    level: 'error',
    fatal: false,
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

      if (input instanceof AppError) {
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
  }

  report() {
    let { level } = this.options

    if (level === 'warning') {
      level = 'warn'
    }

    try {
      // logger
      logger[level](`💔 ${this.message}`)

      if (rollbar.enabled) {
        const error = this.options.error || Error(this.message)

        const response = rollbar[level](this.message, error, this.options)

        if (response.uuid) {
          this.message += `\n\nShare this with a developer:\nhttps://rollbar.com/occurrence/uuid/?uuid=${response.uuid}`
        }
      }
    } catch (err) {
      logger.warn('💔 Error report fail!', err)
    }

    this.show()
  }

  show() {
    dialog.showErrorBox(
      this.options.title || 'A problem has occurred.',
      this.message,
    )

    if (this.options.fatal) {
      app.quit()
    }
  }

  static handle(error) {
    let appError = error

    if (!(appError instanceof this)) {
      appError = new this(
        isError(appError) ? error : 'The program has encountered an unexpected error.',
        {
          error: isError(appError) ? appError : new Error(appError),
        },
      )
    }

    appError.report()
  }
}
