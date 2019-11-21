// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import { existsSync, mkdirSync } from 'fs-extra'
import { AppError } from '../modules/errors'
import { system, paths } from '../modules/tools'
import { settings, nucleus, rollbar } from '../modules/services'

/**
 * Create required directories.
 */
function createDirs() {
  const modelsPath = paths.getModels('Uncategorized')

  if (!existsSync(modelsPath)) {
    mkdirSync(modelsPath, { recursive: true },
      (error) => {
        throw new AppError(`Models directory creation fail.`, { error })
      })
  }
}

/**
 *
 */
async function shutdown() {
  await rollbar.shutdown()
}

export default async ({ app }, inject) => {
  // system stats.
  await system.setup()

  // user settings.
  await settings.setup()

  // analytics.
  await nucleus.setup()

  // bug tracking.
  await rollbar.setup()

  createDirs()
}
