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

const logger = require('logplease').create('system')

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
   * @type {boolean}
   */
  online

  /**
   *
   */
  async setup() {
    const [
      graphics,
      os,
      cpu,
      mem,
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
    this.memory = mem
    this.online = online

    logger.info(`GPU devices: ${this.graphics.length}`)
    logger.info(`RAM: ${this.memory.total} bytes.`)
    logger.info(`Internet connection: ${this.online}`)
    logger.debug(this)
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
