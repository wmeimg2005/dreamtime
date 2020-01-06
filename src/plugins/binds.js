// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import Logger from '@dreamnet/logplease'
import {
  consola, LogEvent, Warning, Exception,
} from '~/modules/consola'

const { getPath } = $provider.paths
const { fs } = $provider

// logger setup.
const logDate = new Date().toJSON().slice(0, 10)

const logDir = getPath('userData', 'logs', logDate)
fs.ensureDirSync(logDir)

Logger.setOptions({
  filename: getPath('userData', 'logs', logDate, 'renderer.log'),
  logLevel: process.env.LOG || 'debug',
})

/**
 * Consola.
 */
window.consola = consola

/**
 * Log exceptions.
 */
window.LogEvent = LogEvent
window.Warning = Warning
window.Exception = Exception

export default ({ redirect }) => {
  window.$redirect = redirect
}
