// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import path from 'path'
import fs from 'fs-extra'
import { api } from 'electron-utils'

/**
 * Returns an absolute path depending on the parameters
 *
 * @param {string} name Name of the base path: https://electronjs.org/docs/all#appgetpathname
 * @param {string} args Series of path segments to join into one path
 */
export const get = (name, ...args) => path.join(api.app.getPath(name), ...args)

/**
 *
 * @param  {...any} args
 */
export const getApp = (...args) => {
  if (process.platform === 'darwin') {
    // /Applications/DreamTime.app/Contents/MacOS/DreamTime
    // /Applications/DreamTime.app/Contents
    return this.get('exe', '..', '..', ...args)
  }

  return this.get('exe', '..', ...args)
}

export const getAppResources = (...args) => {
  if (process.platform === 'darwin') {
    return this.getGui('Resources', ...args)
  }

  return this.getGui('resources', ...args)
}

export const getPower = (...args) => {
  let folder = $settings.folders.cli

  if (!fs.existsSync(folder)) {
    folder = this.get('userData', 'dreampower')
  }

  return path.join(folder, ...args)
}

export const getPowerCheckpoints = (...args) => this.getPower('checkpoints', ...args)

export const getCrop = (...args) => {
  let folder = $settings.folders.cropped

  if (!fs.existsSync(folder)) {
    folder = this.get('temp')
  }

  return path.join(folder, ...args)
}

export const getModels = (...args) => {
  let folder = $settings.folders.models

  if (!fs.existsSync(folder)) {
    folder = this.get('userData', 'models')
  }

  if (!fs.existsSync(folder)) {
    folder = this.get('temp')
  }

  return path.join(folder, ...args)
}

export const getMasks = (...args) => {
  let folder = $settings.folders.masks

  if (!fs.existsSync(folder)) {
    folder = this.get('userData', 'masks')
  }

  if (!fs.existsSync(folder)) {
    folder = this.get('temp')
  }

  return path.join(folder, ...args)
}
