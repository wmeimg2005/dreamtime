// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import { isFunction } from 'lodash'

/**
 *
 * @param {*} min
 * @param {*} max
 */
export function rand(min, max) {
  return Math.random() * (max - min) + min
}

/**
 *
 * @param {*} proto
 */
export function toObject(proto) {
  const jsoned = {}
  const toConvert = proto || this
  Object.getOwnPropertyNames(toConvert).forEach((prop) => {
    const val = toConvert[prop]
    // don't include those
    if (prop === 'toJSON' || prop === 'constructor') {
      return
    }
    if (isFunction(val)) {
      jsoned[prop] = val.bind(jsoned)
      return
    }
    jsoned[prop] = val
  })

  const inherited = Object.getPrototypeOf(toConvert)
  if (inherited !== null) {
    Object.keys(toObject(inherited)).forEach((key) => {
      if (!!jsoned[key] || key === 'constructor' || key === 'toJSON') { return }
      if (isFunction(inherited[key])) {
        jsoned[key] = inherited[key].bind(jsoned)
        return
      }
      jsoned[key] = inherited[key]
    })
  }
  return jsoned
}
