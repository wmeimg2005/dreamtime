// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import { isError, isString } from 'lodash'
import { api } from 'electron-utils'
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

      if (input instanceof AppError) {
        this.options = {
          ...this.options,
          error: input,
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
    const { level } = this.options

    // logger
    logger[level](`💔 ${this.message}`)

    if (rollbar.enabled) {
      const error = this.options.error || Error(this.message)

      try {
        const response = rollbar[level](this.message, error, this.options)

        if (response.uuid) {
          this.message += `\n\nShare this with a developer:\nhttps://rollbar.com/occurrence/uuid/?uuid=${response.uuid}`
        }
      } catch (err) {
        logger.warn('💔 Error trying to report the error!', err)
      }
    }

    this.show()

    api.app.quit()
  }

  show() {
    api.dialog.showErrorBox(
      this.options.title || 'A problem has occurred.',
      this.message,
    )
  }

  static handle(error) {
    let appError = error

    if (!(appError instanceof AppError)) {
      appError = new AppError(
        isError(appError) ? error.message : 'The program has detected an unknown error. Sorry!',
        {
          error: isError(appError) ? appError : new Error(appError),
        },
      )
    }

    appError.report()
  }
}
