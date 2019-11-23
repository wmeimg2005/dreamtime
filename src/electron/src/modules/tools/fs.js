import { basename, join } from 'path'
import {
  statSync, readFileSync, writeFileSync, existsSync,
  unlinkSync, createWriteStream, createReadStream,
} from 'fs-extra'
import { isNil } from 'lodash'
import mime from 'mime-types'
import EventBus from 'js-event-bus'
import axios from 'axios'
import { api, is, platform } from 'electron-utils'
import filesize from 'filesize'
import unzipper from 'unzipper'
import deferred from 'deferred'
import sevenBin from '7zip-bin'
import { extractFull } from 'node-7z'
import { getAppResourcesPath } from './paths'
import { AppError } from '../app-error'

const logger = require('logplease').create('electron:modules:tools:fs')

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
 */
export function getInfo(path) {
  const exists = this.exists(path)
  const mimetype = mime.lookup(path)
  const { name, ext, dir } = path.parse(path)

  let size

  if (exists) {
    const stats = statSync(path)
    size = stats.size / 1000000.0
  }

  return {
    exists,
    name,
    ext,
    dir,
    mimetype,
    size,
  }
}

/**
 *
 * @param {string} path
 * @param {string} encoding
 */
export function read(path, encoding = 'utf-8') {
  return readFileSync(path, { encoding })
}

/**
 *
 * @param {string} path
 * @param {string} dataURL
 */
export function writeDataUrl(path, dataURL) {
  const data = this.getBase64Data(dataURL)
  return writeFileSync(path, data, 'base64')
}

/**
 *
 * @param {string} path
 * @param {string} destinationPath
 */
export function extractZip(path, destinationPath) {
  const def = deferred()

  const stream = createReadStream(path).pipe(unzipper.Extract({ path: destinationPath }))

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
  const def = deferred()

  let pathTo7zip

  if (is.development) {
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
 * @param {Object} options
 */
export function download(url, options = {}) {
  const bus = new EventBus()

  // eslint-disable-next-line no-param-reassign
  options = {
    showSaveAs: false,
    directory: api.app.getPath('downloads'),
    filename: basename(url).split('?')[0].split('#')[0],
    ...options,
  }

  let filepath = join(options.directory, options.filename)

  /**
   * @type {ReadStream}
   */
  let stream

  if (options.showSaveAs) {
    filepath = api.dialog.showSaveDialogSync({
      defaultPath: filepath,
    })
  }

  const deleteFile = () => {
    if (existsSync(filepath)) {
      unlinkSync(filepath)
    }
  }

  axios.request({
    url,
    timeout: 5000,
    responseType: 'stream',
    maxContentLength: -1,
  }).then((response) => {
    const contentLength = response.data.headers['content-length'] || -1
    const totalSize = filesize(contentLength, { exponent: 2, output: 'object' }).value

    const output = createWriteStream(filepath)

    stream = response.data

    stream.on('data', (chunk) => {
      output.write(Buffer.from(chunk))

      const written = filesize(output.bytesWritten, { exponent: 2, output: 'object' }).value

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

  return bus
}

/**
 *
 * @param {string} url
 * @param {Object} options
 */
export function downloadAsync(url, options = {}) {
  return new Promise((resolve, reject) => {
    const bus = this.download(url, options)

    bus.on('end', (filepath) => {
      resolve(filepath)
    })

    bus.on('error', (err) => {
      reject(err)
    })
  })
}
