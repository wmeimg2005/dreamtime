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

const logger = require('logplease').create('power')

export function exec(args, options = {}) {
  args.push('--debug')

  if (settings.processing.usePython) {
    // python script
    args.unshift('main.py')

    logger.debug('Spawning Python script.', {
      args,
      options,
    })

    return spawn('python3', args, {
      cwd: getPowerPath(),
      ...options,
    })
  }

  logger.debug('Spawning executable.', {
    args,
    options,
  })

  return spawn(getPowerPath('dreampower'), args, {
    cwd: getPowerPath(),
    ...options,
  })
}

/**
 *
 * @param {PhotoRun} run
 */
export const transform = (run) => {
  // Independent preferences for the photo
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
    args.push('--export-step', 4, '--export-step-path', run.maskfinFile.path)
  } else if (transformMode === 'import-maskfin') {
    args.push('--steps', '5:5')
  }

  if (useColorTransfer) {
    args.push('--color-transfer')
  }

  // body preferences
  args.push('--bsize', preferences.body.boobs.size)
  args.push('--asize', preferences.body.areola.size)
  args.push('--nsize', preferences.body.nipple.size)
  args.push('--vsize', preferences.body.vagina.size)
  args.push('--hsize', preferences.body.pubicHair.size)

  logger.info('Spawning DreamPower.', {
    input: inputFilepath,
    output: outputFilepath,
    args,
  })

  const process = exec(args)

  const bus = (new EventBus)

  process.on('error', (error) => {
    logger.error(error)
    bus.emit('error', null, error)
  })

  process.stdout.on('data', (output) => {
    const stdout = output.toString().trim().split('\n')
    bus.emit('stdout', null, stdout)
  })

  process.stderr.on('data', (output) => {
    logger.warn(`stderr: ${output}`)
    bus.emit('stderr', null, output)
  })

  process.on('close', (code) => {
    logger.info(`DreamPower exited with code ${code}`)
    bus.emit('close', null, code)

    if (code === 0 || isNil(code)) {
      if (fs.existsSync(run.outputFile.path)) {
        bus.emit('success')
      } else {
        bus.emit('fail', null, true)
      }
    } else {
      bus.emit('fail', null, false)
    }
  })

  bus.on('kill', () => {
    process.stdin.pause()
    process.kill()
  })

  return bus
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

    process.on('error', () => {
      def.resolve()
    })

    process.stdout.on('data', (data) => {
      response += data
    })

    process.on('close', () => {
      try {
        response = semverRegex().exec(response)
        response = `v${response[0]}`
        def.resolve(response)
      } catch (err) {
        def.resolve()
      }
    })
  } catch (err) {
    def.resolve()
  }

  return def.promise
}
