import { isString, attempt } from 'lodash'
import path from 'path'
import slash from 'slash'
import { Consola } from './consola'
import { getMetadata } from '~/workers/fs'

const consola = Consola.create('file')
const { fs } = $provider
const { getPath } = $provider.paths

/**
 * Represents a local file.
 */
export class File {
  /**
   * File name without extension.
   * @type {string}
   */
  name

  /**
   * Full file name.
   * @type {string}
   */
  fullname

  /**
   * Full file path.
   * @type {string}
   */
  path

  /**
   * File extension.
   * @type {string}
   */
  extension

  /**
   * Directory path.
   * @type {string}
   */
  directory

  /**
   * @type {string}
   */
  mimetype

  /**
   * @type {Number}
   */
  size = -1

  /**
   * @type {boolean}
   */
  exists = false

  /**
   * Hash MD5.
   * @type {string}
   */
  md5

  /**
   * Open a local file.
   * @param {string} filepath
   */
  static fromPath(filepath) {
    const file = new this()
    return file.open(filepath)
  }

  /**
   * Open a file from the Internet.
   * @param {string} url
   */
  static async fromUrl(url) {
    consola.debug(`Downloading ${url}`)

    // Download the file in the temporary folder.
    const filepath = await fs.downloadAsync(url, {
      directory: getPath('temp'),
    })

    const file = new this()
    await file.open(filepath)

    return file
  }

  /**
   * Open a file using the metadata.
   * @param {Object} metadata
   */
  static fromMetadata(metadata) {
    const file = new this()
    return file.setMetadata(metadata)
  }

  /**
   *
   * @param {string} filepath
   * @param {boolean} create
   */
  constructor(filepath, create = false) {
    if (isString(filepath)) {
      if (create) {
        attempt(() => {
          fs.unlinkSync(filepath)
          consola.debug(`File deleted: ${filepath}`)
        })
      }

      this.open(filepath)
    }
  }

  /**
   * @param {string} [filepath]
   */
  async open(filepath) {
    if (!isString(filepath)) {
      // Refreshing information.
      filepath = this.path
    }

    const metadata = await getMetadata(filepath)

    return this.setMetadata(metadata)
  }

  /**
   * @param {Object} metadata
   */
  setMetadata(metadata) {
    this.name = metadata.name
    this.extension = metadata.ext
    this.fullname = `${this.name}${this.extension}`
    this.directory = slash(metadata.dir)
    this.path = slash(path.join(this.directory, this.fullname))
    this.mimetype = metadata.mimetype
    this.size = metadata.size
    this.exists = metadata.exists
    this.md5 = metadata.md5

    if (this.exists) {
      consola.debug(`File opened: ${this.path} (${this.md5})`)
    } else {
      consola.debug(`File opened: ${this.path} (does not exist)`)
    }

    return this
  }

  /**
   * Delete the file.
   */
  async unlink() {
    if (!this.exists) {
      return this
    }

    fs.unlinkSync(this.path)
    await this.open()

    consola.debug(`File deleted: ${this.fullname}`)

    return this
  }

  /**
   * Write the dataURL as file content.
   * @param {string} data
   */
  async writeDataURL(data) {
    fs.writeDataURL(this.path, data)
    await this.open()

    return this
  }

  /**
   * @param {string} destination
   */
  copy(destination) {
    fs.copySync(this.path, destination)
    consola.debug(`File copied: ${this.path} -> ${destination}`)
    return this
  }
}
