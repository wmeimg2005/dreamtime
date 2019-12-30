/* eslint-disable max-classes-per-file */
// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import {
  isError, isString, isNil, isPlainObject, isBoolean, pick, flatMap, spread,
} from 'lodash'
import { Log } from './log'

/**
 * Represents an error that has already been handled by Consola
 */
export class HandledError extends Error {
  constructor(message) {
    if (isError(message)) {
      super(message.message)
      this.stack = message.stack
      this.name = message.name
    } else {
      super(message)
    }
  }
}

/**
 * Represents an error that will be handled by Consola.
 * Convenience in case you want to throw an error.
 */
export class LogError extends Error {
  /**
   * @type {Log}
   */
  log

  /**
   * @type {string}
   */
  get level() {
    return 'debug'
  }

  /**
   *
   * @param {Array} args
   */
  static parseArgs(args) {
    let consola
    let title
    let message
    let error
    let options
    let report = false
    let level

    args.forEach((value) => {
      if (value instanceof Consola) {
        consola = value
      } else if (isError(value)) {
        error = value
      } else if (isPlainObject(value)) {
        options = value
      } else if (isString(value) && isNil(message)) {
        message = value
      } else if (isString(value) && isNil(title)) {
        title = message
        message = value
      } else if (isString(value)) {
        level = value
      } else if (isBoolean(value)) {
        report = value
      }
    })

    if (isNil(consola)) {
      consola = window.consola
    }

    return {
      consola,
      title,
      message,
      error,
      options,
      report,
      level,
    }
  }

  /**
   *
   * @param  {...any} args
   */
  constructor(...args) {
    const params = LogError.parseArgs(args)

    if (isError(params.error)) {
      super(params.error.message)
      this.stack = params.error.stack
    } else {
      super(params.message)
    }

    if (isNil(params.level)) {
      params.level = this.level
    }

    const logArgs = flatMap(pick(params, ['level', 'title', 'message', 'error', 'options']))

    // eslint-disable-next-line no-console
    console.log('new LogError', {
      logArgs,
    })

    this.log = consola.log.apply(consola, logArgs)

    this.log.show()

    if (params.report) {
      this.log.report()
    }
  }
}

export class Warning extends LogError {
  get level() {
    return 'warn'
  }
}

export class Exception extends LogError {
  get level() {
    return 'error'
  }
}

/**
 * Global
 */
window.LogError = LogError
window.Warning = Warning
window.Exception = Exception
