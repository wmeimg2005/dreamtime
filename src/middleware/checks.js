// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import { requirements } from '~/modules/system'

/**
 * Detects if the user has what it takes to run the program,
 * otherwise redirects him to the appropriate page.
 */
export default function ({ route, redirect }) {
  /*
  window.$redirect = redirect


  if (!requirements.power.installed || !requirements.power.compatible) {
    // DreamPower is missing
    if (
      !route.path.includes('/settings')
      && route.path !== '/about'
    ) {
      redirect('/about')
    }

    return
  }

  if (!requirements.power.checkpoints) {
    // Checkpoints are missing
    if (route.path !== '/about') {
      redirect('/about#checkpoints')
    }
  }
  */
}
