// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import { isNil, get } from 'lodash'
import compareVersions from 'compare-versions'
import { BaseUpdater } from './base'
import { requirements } from '../system'
import { nucleus } from '../services'

const { settings } = $provider
const { getVersion } = $provider.power
const { getPowerPath } = $provider.paths
const { extractSeven } = $provider.fs
const { activeWindow } = $provider.util
const { app, Notification } = $provider.api

class DreamPowerUpdater extends BaseUpdater {
  /**
   * @type {string}
   */
  get name() {
    return 'dreampower'
  }

  /**
   * @type {string}
   */
  get platform() {
    let platform = super.platform

    if (platform === 'macos' || settings.processing.device === 'CPU') {
      platform = `${platform}-cpuonly`
    } else {
      platform = `${platform}-any`
    }

    return platform
  }

  /**
   * @return {string}
   */
  async _getCurrentVersion() {
    if (!requirements.power.installed) {
      return 'v0.0.0'
    }

    const version = await getVersion()

    if (isNil(version)) {
      return 'v1.1.0'
    }

    return version
  }

  /**
   *
   * @param {*} releases
   */
  _getLatestCompatible(releases) {
    const currentVersion = process.env.npm_package_version

    const minimum = nucleus.v1?.projects?.dreamtime?.releases[`v${currentVersion}`]?.dreampower?.minimum || 'v0.0.1'
    const maximum = nucleus.v1?.projects?.dreamtime?.releases[`v${currentVersion}`]?.dreampower?.maximum

    for (const release of releases) {
      if (compareVersions.compare(release.tag_name, minimum, '<')) {
        continue
      }

      if (!isNil(maximum) && compareVersions.compare(release.tag_name, maximum, '>')) {
        continue
      }

      return release
    }

    return null
  }

  /**
   *
   */
  async setup() {
    this._currentVersion = await this._getCurrentVersion()

    await super.setup()
  }

  /**
   *
   * @param {string} filepath
   */
  async install(filepath) {
    await extractSeven(filepath, getPowerPath())

    // restart!
    app.relaunch()
    app.quit()
  }

  /**
   *
   */
  sendNotification() {
    const notification = new Notification(
      {
        title: `🎉 DreamPower ${this.latestCompatibleVersion}`,
        body: 'A new version of DreamPower is available.',
      },
    )

    notification.show()

    notification.on('click', () => {
      window.$redirect('/wizard/power')

      if (activeWindow()) {
        activeWindow().focus()
      }
    })
  }
}

export const dreampower = (new DreamPowerUpdater)
