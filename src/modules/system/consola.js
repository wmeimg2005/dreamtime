// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import {
  isError, isString, isNil, isPlainObject,
} from 'lodash'
import Logger from 'logplease'
import { Log } from './log'
import { nucleus, logrocket } from '../services'

export class Consola {
  /**
   * @type {string}
   */
  category

  /**
   * @type {Logger.Logger}
   */
  logger

  /**
   *
   * @param {string} [category]
   */
  static create(category) {
    return new this(category)
  }

  /**
   *
   * @param  {Array} args
   */
  static parseArgs(args) {
    let title
    let message
    let error
    let options = {}

    args.forEach((value) => {
      if (isError(value)) {
        error = value
      } else if (isPlainObject(value)) {
        options = value
      } else if (isString(value) && isNil(message)) {
        message = value
      } else if (isString(value) && isNil(title)) {
        title = message
        message = value
      }
    })

    if (isNil(message) && isError(error)) {
      message = error
      error = null
    }

    return {
      message,
      options: {
        title,
        error,
        ...options,
      },
    }
  }

  /**
   *
   * @param {string} [category]
   */
  constructor(category = 'dreamtime') {
    this.category = category
    this.logger = Logger.create(category)
  }

  /**
   *
   * @param {string} message
   * @param {string} level
   * @param {LogOptions} options
   */
  log(level, ...args) {
    const { message, options } = Consola.parseArgs(args)

    // eslint-disable-next-line no-console
    console.log('Logging', {
      args,
      level,
      message,
      options,
    })

    const log = new Log(this.logger, level, message, { ...this.defaultOptions, ...options })
    this.defaultOptions = {}

    return log
  }

  /**
   *
   * @param {string} message
   * @param {LogOptions} options
   */
  debug(...args) {
    return this.log('debug', ...args)
  }

  /**
   *
   * @param {string} message
   * @param {LogOptions} options
   */
  info(...args) {
    return this.log('info', ...args)
  }

  /**
   *
   * @param {string} message
   * @param {LogOptions} options
   */
  warn(...args) {
    return this.log('warn', ...args)
  }

  /**
   *
   * @param {string} message
   * @param {LogOptions} options
   */
  error(...args) {
    return this.log('error', ...args)
  }

  /**
   *
   * @param {string} event
   * @param {Object} payload
   */
  track(event, payload = {}) {
    const category = this.category.toUpperCase()

    if (nucleus.enabled) {
      nucleus.track(`${category}.${event}`, payload)
    }

    if (logrocket.enabled) {
      logrocket.track(event)
    }

    return this
  }
}

/**
 * Default consola
 */
export const consola = (new Consola)

/**
 * Global
 */
window.consola = consola
window.Consola = Consola
