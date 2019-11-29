// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import { Nudify } from './nudify'
import { events } from '../events'

const Store = {
  photos: [],

  waiting: [],

  pending: [],

  finished: [],

  setup() {
    events.on('nudify.update', () => {
      this.photos = Nudify.photos
      this.waiting = Nudify.waiting
      this.pending = Nudify.pending
      this.finished = Nudify.finished
    })
  },
}

export const NudifyStore = new Proxy(Store, {
  get: (obj, prop) => {
    if (prop in obj) {
      return obj[prop]
    }

    if (prop in Nudify) {
      return Nudify[prop]
    }

    return undefined
  },
})
