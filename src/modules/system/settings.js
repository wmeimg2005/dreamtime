// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import {
  isEmpty, isPlainObject, get, set,
} from 'lodash'

const theSettings = {
  /**
   * the payload.
   * a proxy will be used to get or set this information.
   *
   * @type {Object}
   */
  payload: $provider.settings.payload,

  load() {
    return $provider.settings.load()
  },

  save() {
    $provider.settings.payload = this.payload
    return $provider.settings.save()
  },

  /**
   * @param {string} path
   */
  get(path = '') {
    if (isEmpty(path)) {
      return this.payload
    }

    return get(this.payload, path)
  },

  /**
   * @param {string} path
   * @param {any} payload
   */
  set(path, payload) {
    if (isPlainObject(path)) {
      this.payload = path
    } else {
      this.payload = set(this.payload, path, payload)
    }

    this.save()
  },
}

const saveHandler = {
  get(target, property, receiver) {
    try {
      return new Proxy(target[property], saveHandler)
    } catch (err) {
      return Reflect.get(target, property, receiver)
    }
  },
  set(target, property, value, receiver) {
    const response = Reflect.set(target, property, value, receiver)
    theSettings.save()
    return response
  },
}

const handler = {
  get(target, property, receiver) {
    try {
      if (property in target) {
        return target[property]
      }

      if (property in target.payload) {
        return new Proxy(target.payload[property], saveHandler)
      }
      // eslint-disable-next-line no-empty
    } catch (err) { }

    if (property in target.payload) {
      return target.payload[property]
    }

    return Reflect.get(target, property, receiver)
  },
}

export const settings = new Proxy(theSettings, handler)
