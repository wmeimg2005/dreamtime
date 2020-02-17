// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import { isString, endsWith } from 'lodash'
import LogRocket from 'logrocket'
import { BaseService } from './base'
import { dreamtrack } from './dreamtrack'
import { settings } from '../system/settings'
import { Consola } from '../consola'

const { system } = $provider

const consola = Consola.create('logrocket')

const privateExtensions = ['.jpg', '.jpeg', '.png', '.gif']

/**
 * https://logrocket.com/
 * Session tracking.
 */
class LogRocketService extends BaseService {
  /**
   * @type {string}
   */
  get accessToken() {
    return process.env.LOGROCKET_ACCESS_TOKEN || dreamtrack.get('keys.logrocket')
  }

  /**
   * @type {boolean}
   */
  get can() {
    return system.online && isString(this.accessToken) && settings.telemetry?.dom // && process.env.NODE_ENV === 'production'
  }

  /**
   * @type {string}
   */
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
      console: {
        isEnabled: true,
      },
      network: {
        isEnabled: true,
        requestSanitizer(request) {
          // the user does not want to send private dom.
          privateExtensions.forEach((extension) => {
            if (endsWith(request.url.toLowerCase(), extension)) {
              // scrub web address photo.
              request.url = '[private-photo]'
            }
          })
        },
        responseSanitizer(request) {
          // eslint-disable-next-line no-console
          console.log(request)
        },
      },
      dom: {
        isEnabled: true,
        baseHref: $provider.ngrok.getAddress() || dreamtrack.get('urls.internal.cdn'),
      },
    }
  }

  async setup() {
    if (!this.can) {
      return
    }

    try {
      LogRocket.init(this.accessToken, this.config)

      LogRocket.identify(settings.user, {
        settings: settings.payload,
      })

      this.service = LogRocket
      this.enabled = true

      consola.info('Recording session.')
      consola.debug(`Access Token: ${this.accessToken}`)
      consola.debug(`User: ${settings.user}`)
      consola.debug(this.config)
    } catch (err) {
      consola.warn('LogRocket setup failed!', err)
    }
  }
}

export const logrocket = LogRocketService.make()
