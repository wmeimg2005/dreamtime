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
import { app, dialog, ipcMain } from 'electron'
import { activeWindow } from 'electron-util'
import { rollbar } from './services/rollbar'

const logger = require('logplease').create('electron:app-error')

/**
 * @typedef {Object} ErrorOptions
 * @property {string} title
 * @property {Error} error
 * @property {string} level
 * @property {Object} extra
 */

export class AppError extends Error {
  renderer = false

  options = {
    title: null,
    error: null,
    level: 'error',
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
      logger[level](this.message)

      if (rollbar.enabled) {
        const error = this.options.error || this

        const response = rollbar[level](this.message, error, this.options)

        if (response.uuid) {
          this.message += `\n\nShare this with a developer:\nhttps://rollbar.com/occurrence/uuid/?uuid=${response.uuid}`
        }
      }
    } catch (err) {
      logger.warn('Error report fail!', err)
    }
  }

  show() {
    const window = activeWindow()

    if (this.renderer && window) {
      let icon = 'error'

      if (this.level === 'warning' || this.level === 'warn') {
        icon = 'warning'
      }

      if (this.level === 'info') {
        icon = 'info'
      }

      window.webContents.send('alert', {
        title: this.options.title,
        text: this.message,
        icon,
      })
    } else {
      dialog.showErrorBox(
        this.options.title || 'A problem has occurred.',
        this.message,
      )
    }
  }

  handle() {
    if (process.env.NODE_ENV !== 'development') {
      this.report()
    }

    if (!this.options.quiet) {
      this.show()
    }

    if (this.options.fatal) {
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

      appError = new AppError(
        isError(error) ? error : 'The application has encountered an unexpected error. It\'s all we know, try again or restart the application.',
        {
          error: reportError,
          title: 'Unexpected error!',
        },
      )
    }

    appError.handle()
  }

  static handleRenderer(message, stack, options = {}) {
    const appError = new AppError(message, options)

    appError.stack = stack
    appError.renderer = true

    appError.handle()
  }
}
