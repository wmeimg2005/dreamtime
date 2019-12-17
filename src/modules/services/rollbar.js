// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import {
  isNil, isString,
} from 'lodash'
import Rollbar from 'rollbar'
import { remote } from 'electron'
import { BaseService } from './base'
import { nucleus } from './nucleus'

const { settings, system } = $provider
const { execSync } = remote.require('child_process')

const logger = require('logplease').create('services:rollbar')

/**
 * https://rollbar.com
 * Bug tracking.
 */
class RollbarService extends BaseService {
  /**
   * @type {string}
   */
  get accessToken() {
    return process.env.ROLLBAR_ACCESS_TOKEN || nucleus.keys?.rollbar
  }

  /**
   * @type {boolean}
   */
  get can() {
    return isString(this.accessToken)
  }

  /**
   * @type {string}
   */
  get release() {
    try {
      return process.env.GITHUB_SHA || execSync('git rev-parse HEAD').toString().trim()
    } catch (err) {
      return process.env.npm_package_version
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
      enabled: settings.telemetry.bugs,
      verbose: process.env.name === 'development',
      logLevel: 'info',
      nodeSourceMaps: true,
      reportLevel: 'warning',
      payload: {
        environment: process.env.name,
        person: {
          id: settings.user,
        },
        server: {
          root: 'webpack:///',
        },
        client: {
          javascript: {
            source_map_enabled: true,
            guess_uncaught_frames: true,
            code_version: this.release,
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
      this.service = new Rollbar(this.config)
      this.enabled = true

      logger.info('Rollbar started!')
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
