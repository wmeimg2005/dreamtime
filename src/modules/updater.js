// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

// eslint-disable-next-line
import _ from 'lodash'

import DreamTime from './update/dreamtime'
import Checkpoints from './update/checkpoints'
import DreamPower from './update/dreampower'

const debug = require('debug').default('app:modules:updater')

/**
 * Responsible for obtaining information about the current version,
 * the most recent version and identifying if they are different.
 */
export default {
  /**
   *
   */
  async init() {
    // Software
    this.dreamtime = new DreamTime()
    this.checkpoints = new Checkpoints()
    this.dreampower = new DreamPower()

    // Information of the current and most recent version
    await this.dreamtime.fetch()
    await this.checkpoints.fetch()
    await this.dreampower.fetch()

    debug('Updater initialized!', {
      dreamtime: this.dreamtime,
      checkpoints: this.checkpoints,
      dreampower: this.dreampower,
    })
  },
}
