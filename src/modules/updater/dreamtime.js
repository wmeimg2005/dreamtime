// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import { dirname } from 'path'
import delay from 'delay'
import { exec } from 'child_process'
import { BaseUpdater } from './base'

const { activeWindow } = $provider.util
const { shell, app, Notification } = $provider.api

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
      exec(filepath)

      await delay(1000)

      // Quit to update
      app.quit()
    } catch (error) {
      shell.openItem(dirname(filepath))
      throw error
    }
  }

  /**
   *
   */
  sendNotification() {
    const notification = new Notification(
      {
        title: `🎉 DreamTime ${this.latestCompatibleVersion}`,
        body: 'A new version of DreamTime is available.',
      },
    )

    notification.show()

    notification.on('click', () => {
      window.$redirect('/wizard/dreamtime')

      if (activeWindow()) {
        activeWindow().focus()
      }
    })
  }
}

export const dreamtime = new DreamTimeUpdater
