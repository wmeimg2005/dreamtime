// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

const _ = require('lodash')
const { api } = require('electron-utils')
const logger = require('logplease').create('electron:scripts:error')
const { rollbar } = require('./services/rollbar')

/**
 * @typedef {Object} ErrorOptions
 * @property {string} title
 * @property {Error} error
 * @property {string} level
 * @property {Object} extra
 */

class AppError extends Error {
  /**
   *
   * @param {string} message
   * @param {ErrorOptions} options
   */
  constructor(message, options = {}) {
    super(message)

    this.options = {
      title: 'A problem has occurred.',
      error: undefined,
      level: 'error',
      extra: {},
      ...options,
    }
  }

  report() {
    const { title, level, extra } = this.options

    // logger
    logger[level](`💔 ${this.message}`)

    if (rollbar.enabled) {
      const error = this.options.error || Error(this.message)

      try {
        const response = rollbar[level](error, {
          title,
          message: this.message,
          ...extra,
        })

        if (response.uuid) {
          this.message += `\nFor more information please report the following:\nhttps://rollbar.com/occurrence/uuid/?uuid=${response.uuid}`
        }
      } catch (err) {
        logger.warn('💔 Error trying to report the error!', err)
      }
    }

    this.show()

    api.app.exit()
  }

  show() {
    api.dialog.showErrorBox(
      this.options.title,
      this.message,
    )
  }

  static handle(error) {
    let appError = error

    if (!(appError instanceof AppError)) {
      appError = new AppError(
        _.isError(appError) ? error.message : 'The program has detected an unknown error. Sorry!',
        {
          error: _.isError(appError) ? appError : new Error(appError),
        },
      )
    }

    appError.report()
  }
}

module.exports = {
  AppError,
}
