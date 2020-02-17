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
import {
  dreamtrack, logrocket, rollbar,
} from '~/modules/services'
import { requirements } from '~/modules/system'
import { handleError } from '~/modules/consola'

localStorage.debug = ''

// eslint-disable-next-line no-unused-vars
export default async ({ app }, inject) => {
  // Error Handlers.
  window.addEventListener('error', (event) => handleError(event))

  window.addEventListener('unhandledrejection', (rejection) => handleError(rejection.reason))

  Vue.config.errorHandler = (err) => handleError(err)

  // Analytics & Track.
  await dreamtrack.setup()

  // Bug/Session tracking.
  Promise.all([
    rollbar.setup(),
    logrocket.setup(),
  ])

  // Requirements check.
  await requirements.setup()

  // Update providers.
  if (!requirements.power.installed || !requirements.power.checkpoints) {
    // This information is needed for the wizard.
    await Promise.all([
      dreamtime.setup(),
      dreampower.setup(true),
      checkpoints.setup(true),
    ])
  } else {
    Promise.all([
      dreamtime.setup(),
      dreampower.setup(),
      checkpoints.setup(),
    ])
  }

  // Shortcuts.
  inject('provider', $provider)
}
