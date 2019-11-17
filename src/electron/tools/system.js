// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

const si = require('systeminformation')
const _ = require('lodash')

class System {
  /**
   * @type {si.Systeminformation.GraphicsData}
   */
  _graphics

  /**
   * @type {si.Systeminformation.CpuData}
   */
  _cpu

  /**
   * @type {si.Systeminformation.MemData}
   */
  _memory

  constructor() {
    this._setup()
  }

  /**
   *
   */
  async _setup() {
    this._graphics = await si.graphics()
    this._cpu = await si.cpu()
    this._memory = await si.mem()
  }

  /**
   * @return {Array}
   */
  get graphics() {
    return _.filter(this._graphics.controllers, { vendor: 'NVIDIA' })
  }

  /**
   * @return {Number}
   */
  get cores() {
    return this._cpu.cores
  }

  /**
   * @return {Number}
   */
  get memoryTotal() {
    return this._memory.total
  }
}

module.exports = {
  system: new System(),
}
