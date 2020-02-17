// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import { settings, requirements } from '~/modules/system'
import { consola } from '~/modules/consola'

export default function ({ route, redirect }) {
  const { wizard } = settings

  if (!wizard.welcome) {
    if (route.path !== '/wizard/welcome') {
      consola.track('WELCOME')
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

  if (!requirements.power.installed || !requirements.power.compatible) {
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
  }
}
