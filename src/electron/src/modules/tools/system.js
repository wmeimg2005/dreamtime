// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import {
  filter, isNil,
} from 'lodash'
import si from 'systeminformation'
import isOnline from 'is-online'
import { settings } from '../settings'


const logger = require('@dreamnet/logplease').create('system')

class System {
  /**
   * @type {si.Systeminformation.OsData}
   */
  os

  /**
   * @type {si.Systeminformation.GraphicsData}
   */
  _graphics

  /**
   * @type {si.Systeminformation.CpuData}
   */
  cpu

  /**
   * @type {si.Systeminformation.MemData}
   */
  memory

  /**
   * @type {Object}
   */
  snapshot = {
    load: null,
    cpu: {
      speed: null,
      temperature: null,
    },
    memory: null,
    online: false,
  }

  /**
   * @type {boolean}
   */
  online

  /**
   *
   */
  async setup() {
    logger.debug('Collecting system information...')

    const [
      graphics,
      os,
      cpu,
      memory,
      online,
    ] = await Promise.all([
      si.graphics(),
      si.osInfo(),
      si.cpu(),
      si.mem(),
      isOnline(),
    ])

    this._graphics = graphics
    this.os = os
    this.cpu = cpu
    this.memory = memory
    this.online = online

    logger.info(`GPU:`, this.graphics)
    logger.info(`RAM: ${memory.total} bytes.`)
    logger.info(`Online: ${online}`)
  }

  /**
   *
   */
  async takeSnapshot() {
    logger.info('Taking snapshot...')

    const [load, cpuSpeed, cpuTemperature, memory] = await Promise.all([
      si.currentLoad(),
      si.cpuCurrentspeed(),
      si.cpuTemperature(),
      si.mem(),
    ])

    this.snapshot = {
      load,
      cpu: {
        speed: cpuSpeed,
        temperature: cpuTemperature,
      },
      memory,
      settings: settings.payload,
    }

    logger.info(`Current load:`, load)
    logger.info(`CPU Speed:`, cpuSpeed)
    logger.info(`CPU Temperature:`, cpuTemperature)
    logger.info(`Memory:`, memory)

    return this.snapshot
  }

  /**
   * @type {Array}
   */
  get graphics() {
    if (isNil(this._graphics)) {
      return []
    }

    return filter(this._graphics.controllers, { vendor: 'NVIDIA' })
  }
}

export const system = new System
