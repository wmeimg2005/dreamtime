// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import {
  isNil, isString, get,
} from 'lodash'
import { execSync } from 'child_process'
import Rollbar from 'rollbar'
import { BaseService } from './base'
import { settings } from './settings'
import { nucleus } from './nucleus'
import { system } from '../tools/system'

const logger = require('logplease').create('services:rollbar')

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
    return isString(this.accessToken)
  }

  get codeVersion() {
    try {
      return process.env.GIT_SHA || execSync('git rev-parse HEAD').toString().trim()
    } catch (err) {
      return null
    }
  }

  /**
   * @type {Object}
   */
  get config() {
    return {
      accessToken: this.accessToken,
      captureUncaught: false,
      captureUnhandledRejections: false,
      captureIp: 'anonymize',
      enabled: settings.telemetry.enabled,
      verbose: process.env.NODE_ENV === 'development',
      logLevel: 'info',
      nodeSourceMaps: true,
      reportLevel: 'error',
      payload: {
        environment: process.env.NODE_ENV,
        person: {
          id: settings.user,
        },
        client: {
          javascript: {
            source_map_enabled: true,
            code_version: this.codeVersion,
          },
        },
        settings: settings.payload,
        system: {
          graphics: system.graphics,
          cpu: system.cpu,
          os: system.os,
        },
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
      logger.debug(this.accessToken)
    } catch (err) {
      logger.warn('Rollbar setup failed!', err)
    }
  }

  /**
   *
   */
  shutdown() {
    return new Promise((resolve) => {
      if (isNil(this._service)) {
        resolve()
        return
      }

      // wait until send bug reports.
      this._service.wait(() => {
        resolve()
      })
    })
  }
}

export const rollbar = RollbarService.make()
