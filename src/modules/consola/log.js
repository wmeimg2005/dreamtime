// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import {
  isNil, isError, isString, toString, isBoolean,
} from 'lodash'
import he from 'he'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import Logger from '@dreamnet/logplease'
import isPlainObject from 'lodash/isPlainObject'
import { HandledError } from './errors'
import { settings } from '../system/settings'

const { system } = $provider

const LEVELS = [
  'debug',
  'info',
  'warn',
  'error',
]

export class Log {
  /**
   * @type {Logger.Logger}
   */
  logger

  /**
   * @type {string}
   */
  title

  /**
   * @type {string}
   */
  message

  /**
   * @type {boolean}
   */
  quiet = false

  /**
   * @type {string}
   */
  level = 'debug'

  /**
   * @type {Error}
   */
  error

  /**
   * @type {Object}
   */
  extra = {}

  /**
   * @type {boolean}
   */
  reported = false

  /**
   * @type {boolean}
   */
  showed = false

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
    return new HandledError(this.message)
  }

  /**
   * @param {Array} args
   */
  parseArgs(args) {
    args.forEach((value) => {
      if (value instanceof Logger.Logger) {
        this.logger = value
      } else if (isError(value)) {
        this.error = value
      } else if (value instanceof ErrorEvent) {
        this.error = value.error
      } else if (LEVELS.includes(value)) {
        this.level = value
      } else if (isNil(this.message)) {
        this.message = value
      } else if (isNil(this.title) && isString(this.message)) {
        this.title = this.message
        this.message = value
      } else if (isPlainObject(value)) {
        this.extra = value
      } else if (isBoolean(value)) {
        this.quiet = value
      } else {
        // eslint-disable-next-line no-console
        console.warn('Unknown argument:', value)
      }
    })

    if (isNil(this.message) && isError(this.error)) {
      this.message = this.error.message
    }

    if (isNil(this.message)) {
      throw new HandledError('Invalid log.')
    }
  }

  /**
   *
   * @param {Logger.Logger} logger
   * @param {string} level
   * @param {string} message
   * @param {LogOptions} options
   */
  constructor(...args) {
    try {
      this.parseArgs(args)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Log could not be handled:', err)
    }

    if (this.error instanceof HandledError) {
      return
    }

    this.handle().catch((err) => {
      // eslint-disable-next-line no-console
      console.warn('Log could not be handled:', err)
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
    this.logger[this.level](this.message)

    if (this.error) {
      this.logger.error('Exception:', this.error)
    }

    if (this.isError) {
      await this.report()
    }

    if (this.isError && !this.quiet) {
      this.show()
    }
  }

  /**
   *
   */
  async report() {
    if (this.reported) {
      return this
    }

    // System snapshot.
    await system.takeSnapshot()

    const { rollbar, logrocket } = require('../services')

    let rollbarResponse

    // bug tracking.
    if (rollbar.enabled) {
      try {
        rollbarResponse = rollbar[this.level](this.title || this.message, this.error, {
          ...this.extra,
          sessionURL: logrocket.sessionURL,
          snapshot: {
            system: system.snapshot,
            settings: settings.payload,
          },
        })

        this.reported = true
      } catch (err) {
        this.logger.warn('Rollbar report fail!', err)
      }

      // session tracking.
      if (logrocket.enabled && isError(this.error)) {
        try {
          logrocket.captureException(this.error, {
            extra: {
              rollbarURL: `https://rollbar.com/occurrence/uuid/?uuid=${rollbarResponse?.uuid}`,
            },
          })

          this.reported = true
        } catch (err) {
          this.logger.warn('LogRocket report fail!', err)
        }
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

    let html = he.encode(toString(this.message))

    if (isError(this.error)) {
      const stack = he.encode(toString(this.error.stack))
      html = `${html}<details><summary>More information</summary><pre>${stack}</pre></details>`
    }

    Swal.fire({
      title: title || this.title || 'Unexpected problem!',
      html,
      icon: this.isError ? 'error' : 'warning',
      footer: this.reported ? `<code>🐞 This problem has been reported to DreamNet.<br>It will be fixed as soon as possible.</code>` : null,
    })

    this.showed = true

    return this
  }
}
