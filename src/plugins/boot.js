// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import Logger from 'logplease'
import { dreamtime, dreampower, checkpoints } from '~/modules/updater'
import { nucleus, logrocket, rollbar } from '~/modules/services'
import {
  requirements, consola, HandledError, LogError,
} from '~/modules/system'

const { getPath } = $provider.paths

// logger setup
Logger.setOptions({
  filename: getPath('userData', 'dreamtime.renderer.log'),
  logLevel: process.env.LOG || 'debug',
})

// eslint-disable-next-line no-unused-vars
export default async ({ app }, inject) => {
  // catch errors.
  window.addEventListener('error', (err) => {
    if (err instanceof HandledError || err instanceof LogError) {
      return true
    }

    consola.error(err)
    return true
  })

  window.addEventListener('unhandledrejection', (rejection) => {
    if (rejection.reason instanceof HandledError || rejection.reason instanceof LogError) {
      return true
    }

    consola.error(rejection.reason)
    return true
  })

  // analytics.
  await nucleus.setup()

  // bug and session tracking.
  await Promise.all([
    rollbar.setup(),
    logrocket.setup(),
  ])

  // app requirements.
  await requirements.setup()

  // update providers.
  await Promise.all([
    dreamtime.setup(),
    dreampower.setup(),
    checkpoints.setup(),
  ])

  // shortcuts.
  inject('provider', $provider)
  inject('settings', $provider.settings)
  inject('nucleus', nucleus)
}
