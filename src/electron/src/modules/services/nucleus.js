// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import { isNil } from 'lodash'
import Nucleus from 'nucleus-nodejs'
import axios from 'axios'
import { BaseService } from './base'
import { system } from '../tools'
import { settings } from './settings'

const logger = require('logplease').create('services:nucleus')

/**
 * https://nucleus.sh
 * Analytics and bug tracking for Javascript desktop apps.
 */
class NucleusService extends BaseService {
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
      // nucleus configuration
      const config = {
        disableTracking: settings.telemetry.enabled === false,
        disableErrorReports: true,
        userId: settings.user,
        version: process.env.APP_VERSION,
        persist: true,
      }

      Nucleus.init(this.appId, config)

      Nucleus.appStarted()

      this._service = Nucleus

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

    this.payload = (await axios.get(
      `https://nucleus.sh/app/${this.appId}/customdata`,
    )).data
  }
}

export const nucleus = NucleusService.make()
