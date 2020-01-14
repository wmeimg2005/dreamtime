// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import Vue from 'vue'
import tippy from 'tippy.js'
import { Consola } from '~/modules/consola'
import { achievements } from '~/modules/system'
import BaseMixin from '~/mixins/BaseMixin'

const consola = Consola.create('setup')

// lift off!
consola.info('Lift off!')

// base mixin.
Vue.mixin(BaseMixin)

// tippyjs
tippy.setDefaultProps({
  delay: [500, 0],
  arrow: true,
})

export default ({ app }, inject) => {
  const { dream } = require('~/modules')
  const { Nudify, NudifyStore } = require('~/modules/nudify')
  const { settings } = require('~/modules/system')

  // User settings.
  app.$settings = settings
  inject('settings', settings)

  // DreamTime.
  app.$dream = dream
  inject('dream', dream)

  // Nudification/Queue.
  Nudify.setup()

  // Nudify store.
  NudifyStore.setup()
  inject('nudify', NudifyStore)

  // Achievements.
  achievements.setup()

  consola.info('The front-end is ready!')
}
