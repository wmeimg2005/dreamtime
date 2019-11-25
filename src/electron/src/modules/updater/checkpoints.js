// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import { app, Notification } from 'electron'
import { activeWindow } from 'electron-util'
import { BaseUpdater } from './base'
import { AppError } from '../app-error'
import { system } from '../tools/system'
import { getCheckpointsPath, getPowerPath } from '../tools/paths'
import { existsSync, read, extractZip } from '../tools/fs'

class CheckpointsUpdater extends BaseUpdater {
  /**
   * @type {string}
   */
  get name() {
    return 'checkpoints'
  }

  /**
   * @type {string}
   */
  get currentVersion() {
    if (!system.requirements.power.checkpoints) {
      return 'v0.0.0'
    }

    const filepath = getCheckpointsPath('version')

    if (!existsSync(filepath)) {
      return 'v0.0.1'
    }

    const version = read(filepath) || 'v0.0.1'

    return version.trim()
  }

  /**
   *
   * @param {string} filepath
   */
  async install(filepath) {
    await extractZip(filepath, getPowerPath())

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
        title: `🎉 Checkpoints ${this.latestCompatibleVersion} available!`,
        body: 'A new version of the Checkpoints is available.',
      },
    )

    notification.show()

    notification.on('click', () => {
      // window.$redirect('/system/about')
      activeWindow().focus()
    })
  }
}

export const checkpoints = new CheckpointsUpdater()
