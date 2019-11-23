/*
 * DreamTime | (C) 2019 by Ivan Bravo Bravo <ivan@dreamnet.tech>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License 3.0 as published by
 * the Free Software Foundation.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

const { settings } = $provider.services
const { system } = $provider.tools

/**
 * Detects if the user has what it takes to run the program,
 * otherwise redirects him to the appropriate page.
 */
export default function ({ route, redirect }) {
  window.$redirect = redirect

  if (settings.welcome) {
    // First time execution!
    if (route.path !== '/system/welcome') {
      redirect('/system/welcome')
    }

    return
  }

  if (!system.requirements.power.installed) {
    // DreamPower is missing
    if (
      !route.path.includes('/system/settings')
      && route.path !== '/system/about'
    ) {
      redirect('/system/about')
    }

    return
  }

  if (!system.requirements.power.checkpoints) {
    // Checkpoints are missing
    if (route.path !== '/system/about') {
      redirect('/system/about#checkpoints')
    }
  }

  /* if (!platform.requirements.windowsMedia) {
    // Windows Media Pack is missing
    if (route.path !== '/system/about') {
      redirect('/system/about#wmp')
    }

    // return
  } */
}
