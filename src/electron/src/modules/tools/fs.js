import { attempt } from 'lodash'
import { basename, join } from 'path'
import fs from 'fs-extra'
import { app, dialog } from 'electron'
import axios from 'axios'
import deferred from 'deferred'
import { getAppResourcesPath } from './paths'
import { AppError } from '../app-error'

const logger = require('@dreamnet/logplease').create('electron:modules:tools:fs')

// eslint-disable-next-line node/no-deprecated-api
export * from 'fs-extra'

/**
 * Returns the base64 of a dataURL
 * @param {*} dataURL
 */
export function getBase64Data(dataURL) {
  let encoded = dataURL.replace(/^data:(.*;base64,)?/, '')

  if (encoded.length % 4 > 0) {
    encoded += '='.repeat(4 - (encoded.length % 4))
  }

  return encoded
}

/**
 *
 * @param {string} path
 * @param {string} encoding
 */
export function read(path, encoding = 'utf-8') {
  return fs.readFileSync(path, { encoding })
}

/**
 *
 * @param {string} path
 * @param {string} dataURL
 */
export function writeDataURL(path, dataURL) {
  const data = this.getBase64Data(dataURL)
  return fs.writeFileSync(path, data, 'base64')
}

/**
 *
 * @param {string} path
 * @param {string} destinationPath
 */
export function extractZip(path, destinationPath) {
  const unzipper = require('unzipper')

  const def = deferred()

  const stream = fs.createReadStream(path).pipe(unzipper.Extract({ path: destinationPath }))

  stream.on('close', () => {
    def.resolve()
  })

  stream.on('error', (err) => {
    def.reject(err)
  })

  return def.promise
}

/**
 *
 * @param {string} path
 * @param {string} destinationPath
 */
export function extractSeven(path, destinationPath) {
  const { is, platform } = require('electron-util')
  const { extractFull } = require('node-7z')

  const def = deferred()

  let pathTo7zip

  if (is.development) {
    const sevenBin = require('7zip-bin')
    pathTo7zip = sevenBin.path7za
  } else {
    const binName = platform({
      macos: '7za',
      linux: '7za',
      windows: '7za.exe',
    })

    pathTo7zip = getAppResourcesPath('7zip-bin', binName)
  }

  const seven = extractFull(path, destinationPath, {
    $bin: pathTo7zip,
    recursive: true,
  })

  seven.on('end', () => {
    def.resolve()
  })

  seven.on('error', (err) => {
    def.reject(err)
  })

  return def.promise
}

/**
 *
 * @param {string} url
 * @param {Object} [options]
 */
export function download(url, options = {}) {
  const EventBus = require('js-event-bus')
  const bus = new EventBus

  // eslint-disable-next-line no-param-reassign
  options = {
    showSaveAs: false,
    directory: app.getPath('downloads'),
    filename: basename(url).split('?')[0].split('#')[0],
    ...options,
  }

  let filepath = join(options.directory, options.filename)
  let cancelled = false

  if (options.showSaveAs) {
    // save as dialog
    filepath = dialog.showSaveDialogSync({
      defaultPath: filepath,
    })
  }

  const writeStream = fs.createWriteStream(filepath)

  axios.request({
    url,
    responseType: 'stream',
    maxContentLength: -1,
  }).then(({ data, headers }) => {
    const contentLength = headers['content-length'] || -1

    data.on('data', () => {
      const progress = writeStream.bytesWritten / contentLength

      bus.emit('progress', null, {
        progress,
        written: (writeStream.bytesWritten / 1048576).toFixed(2),
        total: (contentLength / 1048576).toFixed(2),
      })
    })

    data.on('error', (err) => {
      throw new AppError(err, { title: 'Download failed.' })
    })

    writeStream.on('error', (err) => {
      throw new AppError(err, { title: 'Download failed.' })
    })

    writeStream.on('finish', () => {
      if (cancelled) {
        bus.emit('cancelled')
        return
      }

      if (!fs.existsSync(filepath)) {
        throw new AppError('The file was not saved correctly.', { title: 'Download failed.' })
      }

      bus.emit('finish', null, filepath)
    })

    data.pipe(writeStream)

    bus.on('cancel', () => {
      cancelled = true

      attempt(() => {
        writeStream.destroy()
        data.destroy()
        fs.unlinkSync(filepath)
      })

      logger.info('Download cancelled by user.')
      bus.emit('cancelled')
    })

    return true
  }).catch((err) => {
    attempt(() => {
      writeStream.destroy(err)
      fs.unlinkSync(filepath)
    })

    logger.warn('Download cancelled due to an error.', err)
    bus.emit('error', null, err)
  })


  /*
  axios.request({
    url,
    responseType: 'stream',
    maxContentLength: -1,
  }).then((response) => {
    const contentLength = response.data.headers['content-length'] || -1
    const totalSize = filesize(contentLength, { exponent: 2, output: 'object' }).value
    const output = createWriteStream(filepath)

    stream = response.data

    stream.on('data', (chunk) => {
      output.write(Buffer.from(chunk))

      const written = filesize(writeStream.bytesWritten, { exponent: 2, output: 'object' }).value

      if (contentLength > 0) {
        const progress = output.bytesWritten / contentLength

        bus.emit('progress', null, {
          progress,
          written,
          total: totalSize,
        })
      } else {
        bus.emit('progress', null, {
          progress: -1,
          written,
          total: -1,
        })
      }
    })

    stream.on('end', () => {
      output.end()

      if (!existsSync(filepath)) {
        throw new AppError('The file was not saved correctly.', { title: 'Download failed.' })
      }

      bus.emit('end', null, filepath)
    })

    stream.on('error', (err) => {
      throw new AppError(err, { title: 'Download failed.' })
    })

    output.on('error', (err) => {
      throw new AppError(err, { title: 'Download failed.' })
    })

    bus.on('cancel', () => {
      output.destroy()
      stream.destroy()
      deleteFile()

      logger.info('Download canceled by user.')
      bus.emit('end')
    })

    return true
  }).catch((err) => {
    stream.destroy(err)
    deleteFile()

    logger.warn('Download canceled due to an error.', err)
    bus.emit('error', null, err)
  })
  */

  return bus
}

/**
 *
 * @param {string} url
 * @param {Object} [options]
 */
export function downloadAsync(url, options = {}) {
  return new Promise((resolve, reject) => {
    const bus = download(url, options)

    bus.on('finish', (filepath) => {
      resolve(filepath)
    })

    bus.on('error', (err) => {
      reject(err)
    })
  })
}
