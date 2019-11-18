// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

const { isNil, isString, get } = require('lodash')
const { Rollbar } = require('rollbar')
const logger = require('logplease').create('electron:scripts:services:rollbar')
const { BaseService } = require('./base')
const { settings } = require('./settings')
const { nucleus } = require('./nucleus')

/**
 * https://rollbar.com
 * Bug tracking service.
 */
class RollbarService extends BaseService {
  /**
   * @type {string}
   */
  get accessToken() {
    return process.env.ROLLBAR_ACCESS_TOKEN || get(nucleus, 'keys.rollbar_access_token')
  }

  /**
   * @type {boolean}
   */
  get can() {
    return !isNil(settings.telemetry.enabled) && isString(this.accessToken)
  }

  /**
   * @type {Object}
   */
  get config() {
    return {
      accessToken: this.accessToken,
      captureUncaught: true,
      captureUnhandledRejections: true,
      captureIp: 'anonymize',
      verbose: process.env.NODE_ENV === 'development',
      nodeSourceMaps: true,
      reportLevel: 'warning',
      payload: {
        environment:
          process.env.NODE_ENV !== 'development' ? 'production' : 'development',
        person: {
          id: settings.user,
        },
        client: {
          javascript: {
            source_map_enabled: true,
            code_version: process.env.APP_VERSION,
          },
        },
        settings: settings.payload,
      },
    }
  }

  /**
   * Setup service
   */
  async setup() {
    if (!this.can) {
      return
    }

    try {
      this._service = new Rollbar(this.config)

      this.enabled = true

      logger.info('Rollbar enabled!')
    } catch (err) {
      logger.warn('💔 Error trying to start Rollbar!', err)
    }
  }
}

module.exports = {
  rollbar: RollbarService.make(),
}
