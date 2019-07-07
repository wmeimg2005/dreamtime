const config = require('./nuxt.config')
const { remote } = require('electron')
const fs = require('fs')
const path = require('path')
const mime = require('mime-types')
const { spawn } = require('child_process')
const EventBus = require('js-event-bus')
const _ = require('lodash')

const { app } = remote

function getBase64Data(dataURL) {
  let encoded = dataURL.replace(/^data:(.*;base64,)?/, '')

  if (encoded.length % 4 > 0) {
    encoded += '='.repeat(4 - (encoded.length % 4))
  }

  return encoded
}

console.log(app.getPath('exe'))

window.deepTools = {
  isValidPhoto(filepath) {
    const mimetype = mime.lookup(filepath)
    const stats = fs.statSync(filepath)
    const filesize = stats.size / 1000000.0

    if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
      return 'The selected file is not a valid photo. Only JPEG or PNG.'
    }

    if (filesize > 5) {
      return 'The selected file is big, this can generate problems. Maximum size: 5MB'
    }

    return true
  },

  getFileAsDataURL(filepath) {
    const mimetype = mime.lookup(filepath)
    const data = fs.readFileSync(filepath, { encoding: 'base64' })

    return `data:${mimetype};base64,${data}`
  },

  getOutputAsDataURL() {
    const outputPath = path.join(
      path.dirname(app.getPath('temp')),
      'output.png'
    )
    return this.getFileAsDataURL(outputPath)
  },

  saveCroppedPhoto(dataURL) {
    const data = getBase64Data(dataURL)

    const inputPath = path.join(path.dirname(app.getPath('temp')), 'input.png')

    console.log({
      exe: 'temp',
      path: path.dirname(app.getPath('temp')),
      inputPath
    })

    fs.writeFileSync(inputPath, data, 'base64')
  },

  process(gpuId, useCpu) {
    if (useCpu === true) {
      gpuId = null
    }

    const cliPath = path.join(
      path.dirname(path.dirname(app.getPath('exe'))),
      'cli'
    )

    /*
    if (config.dev) {

    } else {
      cliPath = path.join(
        path.dirname(path.dirname(app.getPath('exe'))),
        'cli'
      )
    }
    */

    const inputPath = path.join(path.dirname(app.getPath('temp')), 'input.png')

    const outputPath = path.join(
      path.dirname(app.getPath('temp')),
      'output.png'
    )

    const args = [`--input`, inputPath, `--output`, outputPath]

    if (config.dev) {
      args.unshift('main.py')
    }

    if (useCpu) {
      args.push('--cpu')
    }

    if (!_.isNil(gpuId)) {
      args.push(`--gpu`)
      args.push(gpuId)
    }

    console.log({
      cliPath,
      inputPath,
      outputPath,
      args
    })

    const eventBus = new EventBus()
    let child

    if (config.dev) {
      child = spawn('python', args, {
        cwd: cliPath
      })
    } else {
      child = spawn('cli.exe', args, {
        cwd: cliPath
      })
    }

    child.stdout.on('data', data => {
      console.log(`stdout: ${data}`)
      eventBus.emit('stdout', null, data)
    })

    child.stderr.on('data', data => {
      console.log(`stderr: ${data}`)
      eventBus.emit('stderr', null, data)
    })

    child.on('close', code => {
      console.log(`child process exited with code ${code}`)
      eventBus.emit('ready', null, code)
    })

    return eventBus
  }
}
