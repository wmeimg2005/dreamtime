// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import { isNil, isString } from 'lodash'
import { spawn } from 'child_process'
import EventBus from 'js-event-bus'
import deferred from 'deferred'
import semverRegex from 'semver-regex'
import * as fs from 'fs-extra'
import { getPowerPath } from './paths'
import { settings } from '../settings'

const logger = require('@dreamnet/logplease').create('power')

export function exec(args, options = {}) {
  args.push('--debug')

  if (settings.processing.usePython) {
    // python script
    args.unshift('main.py')

    logger.debug('[Python] Running:', {
      args,
      options,
    })

    return spawn('python', args, {
      cwd: getPowerPath(),
      ...options,
    })

    /*
    return spawn('C:\\Users\\koles\\Anaconda3\\envs\\dreampower\\python', args, {
      cwd: getPowerPath(),
      ...options,
    })
    */
  }

  logger.debug('Running:', args)

  return spawn(getPowerPath('dreampower'), args, {
    cwd: getPowerPath(),
    ...options,
  })
}

/**
 *
 * @param {Array} args
 * @param {EventBus} events
 */
export function nudify(args, events, outputFile) {
  const process = exec(args)
  let cancelled = false

  process.on('error', (error) => {
    logger.error(error)
    events.emit('error', null, error)
  })

  process.stdout.on('data', (output) => {
    const stdout = output.toString().trim().split('\n')
    events.emit('stdout', null, stdout)
  })

  process.stderr.on('data', (output) => {
    logger.warn(`stderr: ${output}`)
    events.emit('stderr', null, output)
  })

  process.on('close', (code) => {
    logger.info(`DreamPower exited with code ${code}`)
    events.emit('close', null, code)

    if (cancelled) {
      events.emit('cancelled')
    } else if (code === 0 || isNil(code)) {
      if (fs.existsSync(outputFile.path)) {
        events.emit('success')
      } else {
        events.emit('fail', null, true)
      }
    } else {
      events.emit('fail', null, false)
    }
  })

  events.on('cancel', () => {
    cancelled = true
    process.stdin.pause()
    process.kill()
  })
}

/**
 *
 * @param {PhotoRun} run
 */
export const transform = (run) => {
  // Preferences for the photo
  const { preferences } = run
  const { fileFinal, scaleMode, overlay } = run.photo

  // input
  const inputFilepath = fileFinal.path

  // output
  const outputFilepath = run.outputFile.path

  // CLI Args
  const args = ['run', '--input', inputFilepath, '--output', outputFilepath]

  // device preferences
  if (settings.processing.device === 'CPU') {
    args.push('--cpu', '--n-cores', settings.processing.cores)
  } else {
    for (const id of settings.processing.gpus) {
      args.push('--gpu', id)
    }
  }

  // advanced preferences
  const { useColorTransfer, transformMode } = preferences.advanced

  if (scaleMode === 'overlay') {
    args.push('--overlay', `${overlay.startX},${overlay.startY}:${overlay.endX},${overlay.endY}`)
  } else if (scaleMode !== 'none' && scaleMode !== 'cropjs') {
    args.push(`--${scaleMode}`)
  }

  if (transformMode === 'export-maskfin') {
    args.push('--export-step', 3, '--export-step-path', run.maskfinFile.path)
  } else if (transformMode === 'import-maskfin') {
    args.push('--steps', '5:5')
  }

  if (useColorTransfer) {
    args.push('--color-transfer')
  }

  if (transformMode !== 'import-maskfin') {
    // body preferences
    args.push('--bsize', preferences.body.boobs.size)
    args.push('--asize', preferences.body.areola.size)
    args.push('--nsize', preferences.body.nipple.size)
    args.push('--vsize', preferences.body.vagina.size)
    args.push('--hsize', preferences.body.pubicHair.size)
  }

  const events = (new EventBus)

  setTimeout(() => {
    // Give time for the renderer to receive the events object.
    nudify(args, events, run.outputFile)
  }, 10)

  return events
}

/**
 * @return {boolean}
 */
export function isInstalled() {
  const dirpath = getPowerPath()

  if (!isString(dirpath)) {
    // how the fuck?
    return false
  }

  if (!fs.existsSync(dirpath)) {
    return false
  }

  const binaries = [
    'main.py',
    'dreampower.exe',
    'dreampower',
  ]

  for (const bin of binaries) {
    if (fs.existsSync(getPowerPath(bin))) {
      return true
    }
  }

  return false
}

/**
 * @return {Promise}
 */
export const getVersion = () => {
  const def = deferred()

  try {
    const process = exec(['--version'])

    let response = ''

    process.on('error', (error) => {
      logger.warn(error)
      def.resolve()
    })

    process.stdout.on('data', (data) => {
      response += data
    })

    process.stderr.on('data', (data) => {
      response += data
    })

    process.on('close', () => {
      try {
        response = semverRegex().exec(response)
        response = `v${response[0]}`
        def.resolve(response)
      } catch (err) {
        logger.warn(err)
        def.resolve()
      }
    })
  } catch (err) {
    logger.warn(err)
    def.resolve()
  }

  return def.promise
}
