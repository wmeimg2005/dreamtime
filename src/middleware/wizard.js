// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import { requirements } from '~/modules/system'

const { wizard } = $provider.settings

export default function ({ route, redirect }) {
  window.$redirect = redirect

  if (!wizard.welcome) {
    if (route.path !== '/wizard/welcome') {
      redirect('/wizard/welcome')
    }

    return
  }

  if (!wizard.tos) {
    if (route.path !== '/wizard/tos') {
      redirect('/wizard/tos')
    }

    return
  }

  if (!requirements.power.installed) {
    if (route.path !== '/wizard/power') {
      redirect('/wizard/power')
    }

    return
  }

  if (!requirements.power.checkpoints) {
    if (route.path !== '/wizard/checkpoints') {
      redirect('/wizard/checkpoints')
    }

    return
  }

  if (!wizard.telemetry) {
    if (route.path !== '/wizard/telemetry') {
      redirect('/wizard/telemetry')
    }

    return
  }

  if (!wizard.user) {
    if (route.path !== '/wizard/user') {
      redirect('/wizard/user')
    }

    return
  }

  if (!wizard.telemetry) {
    if (route.path !== '/wizard/telemetry') {
      redirect('/wizard/telemetry')
    }
  }
}
