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
import { AppError, dream } from '~/modules'
import { Nudify, NudifyStore } from '~/modules/nudify'
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

export default async ({ app }, inject) => {
  // catch errors
  window.addEventListener('error', (err) => {
    AppError.handle(err)
    return true
  })

  window.addEventListener('unhandledrejection', (rejection) => {
    AppError.handle(rejection.reason)
    return true
  })

  Vue.config.errorHandler = (err) => {
    AppError.handle(err)
    throw err
  }

  // dreamtime.
  dream.setup()
  inject('dream', dream)

  // nudify.
  Nudify.setup()

  // nudify store.
  NudifyStore.setup()
  inject('nudify', NudifyStore)

  // ready
  logger.info('The front-end is ready!')
}
