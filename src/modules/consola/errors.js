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
  isError,
} from 'lodash'

/**
 * Represents an error that has already been handled by Consola
 */
export class HandledError extends Error {
  name = 'HandledError'

  constructor(message) {
    if (isError(message)) {
      super(message.message)
      this.stack = message.stack
    } else {
      super(message)
    }
  }
}

/**
 * Represents an error that will be handled by Consola.
 * Convenience in case you want to throw an error.
 */
export class LogEvent extends Error {
  name = 'LogEvent'

  /**
   * @type {Array}
   */
  args = []

  /**
   * @type {string}
   */
  get level() {
    return 'debug'
  }

  /**
   *
   * @param  {...any} args
   */
  constructor(...args) {
    super()
    this.args = args
  }
}

export class Warning extends LogEvent {
  get level() {
    return 'warn'
  }
}

export class Exception extends LogEvent {
  get level() {
    return 'error'
  }
}

export function handleError(error) {
  if (error instanceof LogEvent) {
    consola.log(error.level, ...error.args).show()
    return true
  }

  if (error instanceof HandledError) {
    return true
  }

  consola.error(error)
  return true
}
