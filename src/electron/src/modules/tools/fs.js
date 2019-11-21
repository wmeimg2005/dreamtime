import path from 'path'
import fs from 'fs-extra'
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
import { getAppResources } from './paths'

export default {
  /**
   * Returns the base64 of a dataURL
   * @param {*} dataURL
   */
  getBase64Data: (dataURL) => {
    let encoded = dataURL.replace(/^data:(.*;base64,)?/, '')

    if (encoded.length % 4 > 0) {
      encoded += '='.repeat(4 - (encoded.length % 4))
    }

    return encoded
  },

  getInfo: (path) => {
    const exists = this.exists(path)
    const mimetype = mime.lookup(path)
    const { name, ext, dir } = path.parse(path)

    let size

    if (exists) {
      const stats = fs.statSync(path)
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
  },

  read: (path, encoding = 'utf-8') => fs.readFileSync(path, { encoding }),

  writeDataUrl: (path, dataURL) => {
    const data = this.getBase64Data(dataURL)
    return fs.writeFileSync(path, data, 'base64')
  },

  extractZip: (path, destinationPath) => {
    const def = deferred()

    const stream = fs
      .createReadStream(path)
      .pipe(unzipper.Extract({ path: destinationPath }))

    stream.on('close', () => {
      def.resolve()
    })

    stream.on('error', (err) => {
      def.reject(err)
    })

    return def.promise
  },

  extractSeven: (path, destinationPath) => {
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

      pathTo7zip = getAppResources('7zip-bin', binName)
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
  },

  download: (url, options = {}) => {
    const bus = new EventBus()

    // eslint-disable-next-line no-param-reassign
    options = {
      // showSaveAs: false,
      directory: api.app.getPath('downloads'),
      fileName: undefined,
      ...options,
    }

    const fileName = options.fileName
      || path
        .basename(url)
        .split('?')[0]
        .split('#')[0]
    let filePath = path.join(options.directory, fileName)

    const deleteFile = () => {
      if (fs.existsSync(filePath)) {
        // debug(`Deleting file ${filePath}`)
        fs.unlinkSync(filePath)
      }
    }

    deleteFile()

    axios
      .request({
        url,
        timeout: 5000,
        responseType: 'stream',
        maxContentLength: -1,
      })
      .then((response) => {
        const contentLength = response.data.headers['content-length'] || -1
        const mbTotal = filesize(contentLength, {
          exponent: 2,
          output: 'object',
        }).value

        const output = fs.createWriteStream(filePath)
        const stream = response.data

        const cancel = (err) => {
          stream.destroy(err)
          deleteFile()

          if (!isNil(err)) {
            console.warn('Download canceled due to an error', err)
            bus.emit('error', null, err)
          }
        }

        /*
        debug('Downloading file and placing it in a writeStream', {
          url,
          fileName,
          filePath,
          contentLength,
          mbTotal,
          exists: fs.existsSync(filePath),
        })
        */

        output.on('error', (err) => {
          cancel(err)
        })

        stream.on('data', (chunk) => {
          output.write(Buffer.from(chunk))

          if (contentLength > 0) {
            const progress = output.bytesWritten / contentLength
            const mbWritten = filesize(output.bytesWritten, {
              exponent: 2,
              output: 'object',
            }).value

            bus.emit('progress', null, {
              progress,
              mbWritten,
              mbTotal,
            })
          } else {
            const mbWritten = filesize(output.bytesWritten, {
              exponent: 2,
              output: 'object',
            }).value

            bus.emit('progress', null, {
              progress: -1,
              mbWritten,
              mbTotal,
            })
          }
        })

        stream.on('end', () => {
          output.end()
          stream.destroy()

          if (!fs.existsSync(filePath)) {
            filePath = undefined
          }

          bus.emit('end', null, filePath)
        })

        stream.on('error', (err) => {
          cancel(err)
        })

        bus.on('cancel', () => {
          // debug('Download canceled!')
          cancel()
        })

        return true
      })
      .catch((err) => {
        bus.emit('error', null, err)
      })

    return bus
  },

  downloadAsync: (url, options = {}) => new Promise((resolve, reject) => {
    const bus = this.download(url, options)

    bus.on('end', (filePath) => {
      resolve(filePath)
    })

    bus.on('error', (err) => {
      reject(err)
    })
  }),

  ...fs,
}
