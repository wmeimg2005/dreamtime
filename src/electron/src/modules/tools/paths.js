// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import { attempt } from 'lodash'
import { join } from 'path'
import fs from 'fs-extra'
import { app } from 'electron'
import { settings } from '../settings'

/**
 * Returns an absolute path depending on the parameters
 *
 * @param {string} name Name of the base path: https://electronjs.org/docs/all#appgetpathname
 * @param {...string} args Series of path segments to join into one path
 */
export const getPath = (name, ...args) => join(app.getPath(name), ...args)

/**
 *
 * @param  {...string} args
 */
export const getAppPath = (...args) => {
  // return join(app.getAppPath(), ...args)

  if (process.platform === 'darwin') {
    // /Applications/DreamTime.app/Contents/MacOS/DreamTime
    // /Applications/DreamTime.app/Contents
    return getPath('exe', '..', '..', ...args)
  }

  return getPath('exe', '..', ...args)
}

export const getAppResourcesPath = (...args) => {
  if (process.platform === 'darwin') {
    return getAppPath('Resources', ...args)
  }

  return getAppPath('resources', ...args)
}

export const getPowerPath = (...args) => {
  let folder = settings.folders.cli

  if (!fs.existsSync(folder)) {
    folder = getPath('userData', 'dreampower')
  }

  return join(folder, ...args)
}

export const getCheckpointsPath = (...args) => getPowerPath('checkpoints', ...args)

export const getCropPath = (...args) => {
  let folder = settings.folders.cropped

  attempt(() => fs.ensureDirSync(folder))

  if (!fs.existsSync(folder)) {
    folder = getPath('temp')
  }

  return join(folder, ...args)
}

export const getModelsPath = (...args) => {
  let folder = settings.folders.models

  attempt(() => fs.ensureDirSync(folder))

  if (!fs.existsSync(folder)) {
    folder = getPath('userData', 'models')
  }

  if (!fs.existsSync(folder)) {
    folder = getPath('temp')
  }

  return join(folder, ...args)
}

export const getMasksPath = (...args) => {
  let folder = settings.folders.masks

  attempt(() => fs.ensureDirSync(folder))

  if (!fs.existsSync(folder)) {
    folder = getPath('userData', 'masks')
  }

  if (!fs.existsSync(folder)) {
    folder = getPath('temp')
  }

  return join(folder, ...args)
}
