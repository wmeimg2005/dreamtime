import { isString } from 'lodash'
import { join } from 'path'
import { getMetadata } from '~/workers/fs'

const {
  writeDataURL, downloadAsync,
  unlinkSync, copySync,
} = $provider.tools.fs


const { getPath } = $provider.tools.paths

export class File {
  name

  fullname

  path

  extension

  directory

  mimetype

  size = -1

  exists = false

  md5

  dataURL = ''

  /**
   *
   * @param {*} filepath
   */
  static fromPath(filepath) {
    const file = new this()
    return file.open(filepath)
  }

  /**
   *
   */
  static async fromUrl(url) {
    const filepath = await downloadAsync(url, {
      directory: getPath('temp'),
    })

    const file = new this()
    await file.open(filepath)

    return file
  }

  /**
   *
   */
  static fromMetadata(metadata) {
    const file = new this()
    return file.setMetadata(metadata)
  }

  /**
   *
   * @param {*} filepath
   */
  constructor(filepath) {
    if (isString(filepath)) {
      this.open(filepath)
    }
  }

  /**
   *
   * @param {string} [filepath]
   */
  async open(filepath) {
    if (!isString(filepath)) {
      // eslint-disable-next-line no-param-reassign
      filepath = this.path
    }

    const metadata = await getMetadata(filepath)
    return this.setMetadata(metadata)
  }

  /**
   *
   * @param {Object} metadata
   */
  setMetadata(metadata) {
    this.name = metadata.name
    this.extension = metadata.ext
    this.directory = metadata.dir
    this.mimetype = metadata.mimetype
    this.size = metadata.size
    this.exists = metadata.exists
    this.md5 = metadata.md5
    this.dataURL = metadata.dataURL
    this.fullname = `${this.name}${this.extension}`
    this.path = join(this.directory, this.fullname)
    return this
  }

  /**
   *
   */
  async unlink() {
    if (!this.exists) {
      return
    }

    unlinkSync(this.path)
    await this.open()
  }

  /**
   *
   */
  async writeDataURL(data) {
    writeDataURL(this.path, data)
    await this.open()
  }

  /**
   *
   * @param {*} destination
   */
  copy(destination) {
    return copySync(this.path, destination)
  }
}
