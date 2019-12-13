// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import { isString, get } from 'lodash'
import LogRocket from 'logrocket'
import { BaseService } from './base'
import { nucleus } from './nucleus'

const { settings, system } = $provider

const logger = require('logplease').create('services:logrocket')

class LogRocketService extends BaseService {
  /**
   * @type {string}
   */
  get accessToken() {
    return process.env.LOGROCKET_ACCESS_TOKEN || nucleus.keys?.logrocket
  }

  /**
   * @type {boolean}
   */
  get can() {
    return isString(this.accessToken)
  }

  get release() {
    return process.env.GITHUB_SHA || process.env.npm_package_version
  }

  /**
   * @type {Object}
   */
  get config() {
    return {
      release: this.release,
      shouldCaptureIP: false,
      /*dom: {
        baseHref: nucleus.urls?.internal?.cdn || '',
      }, */
    }
  }

  async setup() {
    if (!this.can) {
      return
    }

    try {
      LogRocket.init(this.accessToken)
      LogRocket.identify(settings.user || 'unknown', {
        settings: settings.payload,

      })

      this.service = LogRocket
      this.enabled = true

      logger.info('LogRocket enabled!')
      logger.debug(this.accessToken)
    } catch (err) {
      logger.warn('LogRocket setup failed!', err)
    }
  }
}

export const logrocket = LogRocketService.make()
