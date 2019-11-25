// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import { shell, app, Notification } from 'electron'
import { dirname } from 'path'
import delay from 'delay'
import { activeWindow } from 'electron-util'
import { BaseUpdater } from './base'
import { AppError } from '../app-error'

class DreamTimeUpdater extends BaseUpdater {
  /**
   * @type {string}
   */
  get name() {
    return 'dreamtime'
  }

  /**
   * @type {string}
   */
  get currentVersion() {
    return `v${process.env.npm_package_version}`
  }

  /**
   *
   * @param {string} filepath
   */
  async install(filepath) {
    try {
      shell.openExternal(filepath)

      await delay(1500)

      // close the program to update correctly
      app.quit()
    } catch (error) {
      shell.openItem(dirname(filepath))
      throw new AppError('Update installation failed. The folder where the update is located will open.', { error })
    }
  }

  /**
   *
   */
  sendNotification() {
    const notification = new Notification(
      {
        title: `🎉 DreamTime ${this.latestCompatibleVersion} available!`,
        body: 'A new version of DreamTime is available.',
      },
    )

    notification.show()

    notification.on('click', () => {
      // window.$redirect('/system/about')
      activeWindow().focus()
    })
  }
}

export const dreamtime = new DreamTimeUpdater()
