// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

const {
  set, get, isNil, isPlainObject,
} = require('lodash')
const fs = require('fs')
const logger = require('logplease').create('electron:scripts:services')

class BaseService {
  /**
   * the payload.
   * a proxy will be used to get or set this information.
   *
   * @type {Object}
   */
  payload = {}

  /**
   * the service.
   *
   * @type {Object}
   */
  _service

  /**
   * service enabled?
   *
   * @type {Boolean}
   */
  enabled: false

  /**
   * file where to save the payload.
   *
   * @type {string}
   */
  get path() {
    return null
  }

  /**
   * Create a new instance with a Proxy.
   *
   * @return {BaseService}
   */
  static make() {
    return new Proxy(new this(), {
      get: (obj, prop) => {
        if (prop in obj) {
          return obj[prop]
        }

        /* eslint-disable no-underscore-dangle */
        if (obj._service && prop in obj._service) {
          return obj._service[prop]
        }
        /* eslint-enable no-underscore-dangle */

        if (prop in obj.payload) {
          return obj.payload[prop]
        }

        return undefined
      },

      /* eslint-disable no-param-reassign */
      set: (obj, prop, value) => {
        if (!isNil(obj.payload)) {
          if (prop in obj.payload) {
            obj.payload[prop] = value
            obj.save()

            return true
          }
        }

        obj[prop] = value
        return true
      },
      /* eslint-enable no-param-reassign */
    })
  }

  /**
   * Setup service
   */
  async setup() {
    await this.load()
  }

  /**
   * Load the service file.
   */
  async load() {
    if (isNil(this.path)) {
      return
    }

    this.payload = JSON.parse(fs.readFileSync(this.path))

    logger.info('💖 Service loaded.')
    logger.debug(this.payload)
  }

  /**
   * Save the service file.
   * This function is called automatically if you set a first level variable.
   */
  async save() {
    if (isNil(this.path)) {
      return
    }

    const payload = JSON.stringify(this.payload, null, 2)
    fs.writeFileSync(this.getPath(), payload)

    logger.debug('💖 Service saved.')
  }

  /**
   * Returns the value
   *
   * @param {string} path
   */
  get(path = '') {
    if (path.length === 0) {
      return this.payload
    }

    return get(this.payload, path)
  }

  /**
   * Set a new value in the settings
   *
   * @param {any} path
   * @param {any} payload
   */
  set(path, payload) {
    if (isPlainObject(path)) {
      this.payload = path
      this.save()
    }

    this.payload = set(this.payload, path, payload)
    this.save()
  }
}

module.exports = {
  BaseService,
}
