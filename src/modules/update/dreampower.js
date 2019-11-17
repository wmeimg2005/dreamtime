// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import _ from 'lodash'
import compareVersions from 'compare-versions'
import Base from './base'
import dream from '../dream'
import platform from '../platform'

export default class DreamPower extends Base {
  /**
   * Returns if this provider is activated
   */
  can() {
    if (!$nucleus.isEnabled) {
      return false
    }

    if (_.isNil(_.get($nucleus, 'about.dreampower.name'))) {
      return false
    }

    if (_.isNil(_.get($nucleus, 'about.dreampower.title'))) {
      return false
    }

    if (_.isNil(_.get($nucleus, 'about.dreampower.github'))) {
      return false
    }

    return true
  }

  /**
   * Returns the code name of the project.
   * It is usually the lowercase name
   */
  getName() {
    return $nucleus.about.dreampower.name
  }

  /**
   * Returns the domain and repository of the project in Github.
   * Example: private-dreamnet/dreamtime
   */
  getGithubRepository() {
    return $nucleus.about.dreampower.github
  }

  /**
   * Returns the current version of the project
   */
  async getCurrentVersion() {
    if (!platform.requirements.cli) {
      return 'v0.0.0'
    }

    if (this.currentVersion) {
      return this.currentVersion
    }

    const version = await $tools.getPowerVersion()

    if (_.isEmpty(version)) {
      this.currentVersion = 'v1.1.0'
    } else {
      this.currentVersion = version
    }

    return this.currentVersion
  }

  /**
   *
   */
  getUpdatePlatform() {
    let platform = $tools.utils.platform({
      macos: 'macos',
      windows: 'windows',
      linux: 'ubuntu',
    })

    if (platform === 'macos' || $settings.processing.device === 'CPU') {
      platform = `${platform}-cpuonly`
    } else {
      platform = `${platform}-any`
    }

    return platform
  }

  /**
   *
   * @param {string} latest
   * @return {boolean}
   */
  async isAvailable(latest) {
    const compatibility = $nucleus.compatibility[`v${dream.version}`]

    for (const conditions of compatibility) {
      // v1.2.2 v1.0.0 >= = true
      // v1.2.2 v.1.0 <= = false
      if (!compareVersions.compare(latest, conditions[0], conditions[1])) {
        return false
      }
    }

    return super.isAvailable(latest)
  }

  /**
   *
   * @param {Array} releases
   */
  getLatestRelease(releases) {
    const currentVersion = this.getCurrentVersion()

    return _.find(releases, (release) => this.isAvailable(release.tag_name) || release.tag_name === currentVersion)
  }

  /**
   * Install the downloaded update
   *
   * @param {string} filePath
   */
  async install(filePath) {
    await $tools.fs.extractSeven(filePath, $tools.paths.getCli())

    this._resetUpdating()

    $tools.utils.api.app.relaunch()
    $tools.utils.api.app.exit()
  }

  /**
   * Send a notification indicating update available
   */
  sendNotification() {
    const notification = new Notification(
      `✨ DreamPower ${this.latest.tag_name} available!`,
      {
        body: 'A new version of DreamPower is available for update.',
      },
    )

    notification.onclick = () => {
      window.$redirect('/system/about')
      $tools.utils.activeWindow().focus()
    }
  }
}
