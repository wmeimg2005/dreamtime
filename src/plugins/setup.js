// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import Vue from 'vue'
import moment from 'moment'
import tippy from 'tippy.js'
import Combokeys from 'combokeys'
import { dream } from '~/modules'
import { Nudify, NudifyStore } from '~/modules/nudify'
import { HandledError, LogError } from '~/modules/system'
import BaseMixin from '~/mixins/BaseMixin'

const logger = require('logplease').create('plugins:setup')

// lift off!
logger.info('Lift off!')

// base mixin
Vue.mixin(BaseMixin)

// momentjs
moment.locale('en')

// tippyjs
tippy.setDefaultProps({
  delay: 100,
  arrow: true,
})

export default async ({ app, redirect }, inject) => {
  // catch errors
  Vue.config.errorHandler = (err) => {
    if (err instanceof HandledError || err instanceof LogError) {
      return
    }

    consola.error(err)
  }

  // dreamtime.
  dream.setup()
  app.$dream = dream
  inject('dream', dream)

  // nudify.
  Nudify.setup()

  // nudify store.
  NudifyStore.setup()
  inject('nudify', NudifyStore)

  // easter eggs!
  const combokeys = new Combokeys(document.documentElement)

  combokeys.bind('b a d t i m e', () => {
    redirect('/games/badtime')
  })

  // ready
  logger.info('The front-end is ready!')
}
