// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import Logger from 'logplease'
import { AppError } from '~/modules'
import { dreamtime, dreampower, checkpoints } from '~/modules/updater'
import { nucleus, logrocket, rollbar } from '~/modules/services'
import { requirements } from '~/modules/system'

const { getPath } = $provider.paths

// const logger = Logger.create('plugins:boot')

// logger setup
Logger.setOptions({
  filename: getPath('userData', 'dreamtime.renderer.log'),
  logLevel: process.env.LOG || 'debug',
})

// global apperror
window.AppError = AppError

// eslint-disable-next-line no-unused-vars
export default async ({ app }, inject) => {
  // analytics.
  await nucleus.setup()

  // bug and session tracking.
  await rollbar.setup()
  await logrocket.setup()

  // dreamtime requirements.
  await requirements.setup()

  // update providers.
  dreamtime.setup()
  dreampower.setup()
  checkpoints.setup()

  // shortcuts.
  inject('provider', $provider)
  inject('settings', $provider.settings)
  inject('nucleus', nucleus)
}
