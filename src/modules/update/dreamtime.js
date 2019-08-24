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
import path from 'path'
import Base from './base'
import dream from '../dream'

export default class extends Base {
  /**
   * Returns if this provider is activated
   */
  can() {
    if (!$nucleus.isEnabled) {
      return false
    }

    if (_.isNil(_.get($nucleus, 'about.dreamtime.name'))) {
      return false
    }

    if (_.isNil(_.get($nucleus, 'about.dreamtime.title'))) {
      return false
    }

    if (_.isNil(_.get($nucleus, 'about.dreamtime.github'))) {
      return false
    }

    return true
  }

  /**
   * Returns the code name of the project.
   * It is usually the lowercase name
   */
  getName() {
    return $nucleus.about.dreamtime.name
  }

  /**
   * Returns the name of the project.
   */
  getTitle() {
    return $nucleus.about.dreamtime.title
  }

  /**
   * Returns the domain and repository of the project in Github.
   * Example: private-dreamnet/dreamtime
   */
  getGithubRepository() {
    return $nucleus.about.dreamtime.github
  }

  /**
   * Returns the current version of the project
   */
  getCurrentVersion() {
    return dream.version
  }

  /**
   * Install the downloaded update
   * @param {string} filePath
   */
  async install(filePath) {
    try {
      $tools.shell.openItem(filePath)
    } catch (err) {
      $tools.shell.openItem(path.dirname(filePath))
    }
  }

  /**
   * Send a notification indicating update available
   */
  sendNotification() {
    const notification = new Notification(
      `🎉 DreamTime ${this.latest.tag_name} available!`,
      {
        body: 'A new version of DreamTime is available for download.'
      }
    )

    notification.onclick = () => {
      window.$redirect('/system/about')
      $tools.utils.activeWindow().focus()
    }
  }
}
