// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import { isNil } from 'lodash'
import axios from 'axios'
import { BaseService } from './base'

const { system, settings } = $provider

const logger = require('logplease').create('services:nucleus')

console.log(settings)

/**
 * https://nucleus.sh
 * Analytics and bug tracking for Javascript desktop apps.
 */
export class NucleusService extends BaseService {
  /**
   * @type {string}
   */
  get appId() {
    return process.env.NUCLEUS_APPID
  }

  /**
   * @type {boolean}
   */
  get can() {
    return !isNil(this.appId)
  }

  /**
   * Setup service
   */
  async setup() {
    if (!this.can) {
      return
    }

    try {
      const Nucleus = require('nucleus-nodejs')

      // nucleus configuration
      const config = {
        disableTracking: settings.telemetry.enabled === false,
        disableErrorReports: true,
        userId: settings.user,
        version: process.env.npm_package_version,
        persist: true,
      }

      Nucleus.init(this.appId, config)

      Nucleus.appStarted()

      this.service = Nucleus

      await this.fetchData()
      setInterval(this.fetchData.bind(this), 15 * 60 * 1000)

      this.enabled = true

      logger.info('Nucleus enabled!')
      logger.debug(this.appId)
    } catch (err) {
      logger.warn('Nucleus setup failed!', err)
    }
  }

  async fetchData() {
    if (!system.online) {
      return
    }

    try {
      this.payload = (await axios.get(
        `https://nucleus.sh/app/${this.appId}/customdata`,
      )).data
      // eslint-disable-next-line no-empty
    } catch (error) { }
  }
}

export const nucleus = NucleusService.make()
