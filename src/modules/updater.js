/*
 * DreamTime | (C) 2019 by Ivan Bravo Bravo <ivan@dreamnet.tech>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License 3.0 as published by
 * the Free Software Foundation.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

// eslint-disable-next-line
import _ from 'lodash'

import DreamTime from './update/dreamtime'
import Checkpoints from './update/checkpoints'

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

    // Information of the current and most recent version
    await this.dreamtime.fetch()
    await this.checkpoints.fetch()

    debug('Updater initialized!', {
      dreamtime: this.dreamtime,
      checkpoints: this.checkpoints
    })
  }
}
