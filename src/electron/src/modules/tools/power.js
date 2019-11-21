// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import { spawn } from 'child_process'
import EventBus from 'js-event-bus'
import deferred from 'deferred'
import semverRegex from 'semver-regex'
import { getPower } from './paths'
import { settings } from '../services'

/**
 *
 * @param {Object} job
 */
export const transform = (job) => {
  // Independent preferences for the photo
  const { preferences } = job

  // input
  const photoFilepath = job.photo.file.getPath()

  // output
  const outputFilepath = job.file.getPath()

  // CLI Args
  const args = ['run', '--input', photoFilepath, '--output', outputFilepath]

  if (settings.processing.usePython) {
    // use python script
    args.unshift('main.py')
  }

  // Device preferences
  if (settings.processing.device === 'CPU') {
    args.push('--cpu', '--n-cores', settings.processing.cores)
  } else {
    for (const id of settings.processing.gpus) {
      args.push('--gpu', id)
    }
  }

  // Advanced preferences
  const { scaleMode, useColorTransfer } = preferences.advanced

  if (scaleMode === 'cropjs') {
    const { crop } = job.photo
    args.push('--overlay', `${crop.startX},${crop.startY}:${crop.endX},${crop.endY}`)
  } else if (scaleMode !== 'none') {
    args.push(`--${scaleMode}`)
  }

  if (useColorTransfer) {
    args.push('--color-transfer')
  }

  // Body preferences
  args.push('--bsize', preferences.body.boobs.size)
  args.push('--asize', preferences.body.areola.size)
  args.push('--nsize', preferences.body.nipple.size)
  args.push('--vsize', preferences.body.vagina.size)
  args.push('--hsize', preferences.body.pubicHair.size)

  /*
  debug('The transformation process has begun!', {
    input: photoFilepath,
    output: outputFilepath,
    preferences,
    args,
    job,
  })
  */

  let process
  const bus = new EventBus()

  if (settings.processing.usePython) {
    // python script
    process = spawn('python3', args, {
      cwd: getPower(),
    })
  } else {
    process = spawn(getPower('dreampower'), args, {
      cwd: getPower(),
    })
  }

  process.on('error', (error) => {
    console.error(error)
    bus.emit('error', null, error)
  })

  process.stdout.on('data', (data) => {
    console.info(`stdout: ${data}`)
    bus.emit('stdout', null, data)
  })

  process.stderr.on('data', (data) => {
    console.warn(`stderr: ${data}`)
    bus.emit('stderr', null, data)
  })

  process.on('close', (code) => {
    console.log(`CLI process exited with code ${code}`)
    bus.emit('ready', null, code)
  })

  bus.on('kill', () => {
    process.stdin.pause()
    process.kill()
  })

  return bus
}

/**
 * @return {Promise}
 */
export const getVersion = () => {
  const def = deferred()

  let process
  let response = ''

  if (settings.processing.usePython) {
    // python script
    process = spawn('python3', ['main.py', '--version'], {
      cwd: getPower(),
    })
  } else {
    process = spawn(getPower('dreampower'), ['--version'])
  }

  process.on('error', () => {
    def.resolve('')
  })

  process.stdout.on('data', (data) => {
    response += data
  })

  process.on('close', () => {
    response = semverRegex().exec(response)
    response = `v${response[0]}`

    def.resolve(response)
  })

  return def.promise
}
