// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import Vue from 'vue'
import { dreamtime, dreampower, checkpoints } from '~/modules/updater'
import { nucleus, logrocket, rollbar } from '~/modules/services'
import { requirements } from '~/modules/system'
import { handleError } from '~/modules/consola'

// eslint-disable-next-line no-unused-vars
export default async ({ app }, inject) => {
  // catch errors.
  window.addEventListener('error', (event) => handleError(event))

  window.addEventListener('unhandledrejection', (rejection) => handleError(rejection.reason))

  Vue.config.errorHandler = (err) => handleError(err)

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
  inject('nucleus', nucleus)
}
