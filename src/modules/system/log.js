// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import { isError } from 'lodash'
import Swal from 'sweetalert2'
import { HandledError } from './errors'
import { rollbar, logrocket } from '../services'

const { system } = $provider

/**
 * @typedef {Object} LogOptions
 * @property {string} title
 * @property {boolean} quiet
 */

export class Log {
  /**
   * @type {string}
   */
  message

  /**
   * @type {string}
   */
  level = 'debug'

  /**
   * @type {Error}
   */
  error

  /**
   * @type {LogOptions}
   */
  options = {
    title: null,
    quiet: false,
  }

  /**
   * @type {boolean}
   */
  reported = false

  /**
   * @type {boolean}
   */
  showed = false

  /**
   * @type {Logger.Logger}
   */
  logger

  /**
   * @type {boolean}
   */
  get isError() {
    return this.level === 'error'
  }

  /**
   * @type {boolean}
   */
  get isWarning() {
    return this.level === 'warn'
  }

  /**
   * @type {HandledError}
   */
  get throwable() {
    return new HandledError(this.error || this.message)
  }

  /**
   *
   * @param {Logger.Logger} logger
   * @param {string} level
   * @param {string} message
   * @param {LogOptions} options
   */
  constructor(logger, level, message, options = {}) {
    this.logger = logger
    this.level = level
    this.options = options

    if (isError(message)) {
      this.error = message
      this.message = this.error.message
    } else {
      this.message = message
    }

    if (isError(options.error)) {
      this.error = options.error
      delete options.error
    }

    console.log(this.logger)

    this.handle().catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Something incredibly bad has happened:', err)
    })

    if (this.isError) {
      throw this.throwable
    }
  }

  /**
   *
   */
  async handle() {
    // logger.
    this.logger[this.level](this.throwable)

    if (this.isError) {
      // recolect system snapshot.
      await system.takeSnapshot()
    }

    if (this.isError) {
      this.report()
    }

    if (this.isError && !this.options.quiet) {
      this.show()
    }
  }

  /**
   *
   */
  report() {
    if (this.reported) {
      return this
    }

    const {
      level, options, error, message,
    } = this

    let rollbarResponse

    // bug tracking.
    if (rollbar.enabled) {
      try {
        rollbarResponse = rollbar[level](error || message, {
          ...options,
          sessionURL: logrocket.sessionURL,
          systemSnapshot: system.snapshot,
        })

        this.reported = true
      } catch (err) {
        this.logger.warn('Rollbar report fail!', err)
      }
    }

    // session tracking.
    if (logrocket.enabled && isError(error)) {
      try {
        logrocket.captureException(error, {
          extra: {
            rollbarURL: `https://rollbar.com/occurrence/uuid/?uuid=${rollbarResponse?.uuid}`,
          },
        })

        this.reported = true
      } catch (err) {
        this.logger.warn('LogRocket report fail!', err)
      }
    }

    return this
  }

  /**
   *
   */
  show(title) {
    if (this.showed) {
      return this
    }

    const {
      message, error, options,
    } = this

    let html = message

    if (isError(error)) {
      html = `${html}<br><br><pre>${error.stack}</pre>`
    }

    Swal.fire({
      title: title || options.title || 'Unexpected problem!',
      html,
      icon: this.isError ? 'error' : 'warning',
      footer: this.reported ? `<code>🐞 This problem has been reported to DreamNet.<br>It will be fixed as soon as possible.</code>` : null,
    })

    this.showed = true

    return this
  }
}
