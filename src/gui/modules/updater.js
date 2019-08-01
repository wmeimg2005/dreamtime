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

import _ from 'lodash'
import axios from 'axios'
import compareVersions from 'compare-versions'
import dream from './dream'

const debug = require('debug').default('app:modules:updater')

// Repository API
// For now changing this is useless unless the new API offers the same response as Github
const BASE_URL = 'https://api.github.com/repos/'

// Unknown Information
const DEFAULT_PAYLOAD = {
  available: false,

  current: {
    tag_name: '0.0.0'
  },

  latest: {
    tag_name: '0.0.0'
  }
}

/**
 * Responsible for obtaining information about the current version,
 * the most recent version and identifying if they are different.
 */
export default {
  /**
   *
   */
  async init() {
    // Indicates if the releases information is available
    this.available = false

    if (!$nucleus.can() || !_.get($nucleus, 'updater.dreampower')) {
      console.warn(
        'Updater: Nucleus is not available! Unable to get the latest version.'
      )
      return
    }

    // Unknown Information
    this.dreampower = DEFAULT_PAYLOAD
    this.dreamtime = DEFAULT_PAYLOAD

    //
    this.http = axios.create({
      baseURL: BASE_URL
    })

    try {
      // DreamTime
      await this._fetchDreamTime()

      // DreamPower
      await this._fetchDreamPower()

      this.available = true

      debug('Updater initialized!', {
        dreampower: this.dreampower,
        dreamtime: this.dreamtime
      })
    } catch (err) {
      console.warn('Updater: There was a problem: ', err)
    }
  },

  /**
   * Fetch version information from a Github Repository
   *
   * @param {string} repository
   */
  async _fetchFromGithub(repository) {
    const response = await this.http.get(`${repository}/releases`)

    // Stable versions only
    const releases = _.filter(response.data, {
      draft: false,
      prerelease: false
    })

    if (releases.length === 0) {
      return DEFAULT_PAYLOAD
    }

    const latest = releases[0]
    const current = _.find(releases, { tag_name: `v${dream.version}` })

    return {
      latest,
      current,
      available: compareVersions(latest.tag_name, dream.version) === 1
    }
  },

  /**
   * Fetch version information about DreamPower (checkpoints)
   */
  async _fetchDreamPower() {
    this.dreampower = await this._fetchFromGithub(
      $nucleus.updater.dreampower // Application settings (nucleus.sh)
    )
  },

  /**
   * Fetch version information about DreamTime
   */
  async _fetchDreamTime() {
    this.dreamtime = await this._fetchFromGithub(
      $nucleus.updater.dreampower // Application settings (nucleus.sh)
    )
  }
}
