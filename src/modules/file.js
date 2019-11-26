import { isNil } from 'lodash'
import { join } from 'path'

const debug = require('debug').default('app:modules:file')

const {
  writeDataUrl, downloadAsync, getInfo,
  unlinkSync, read, copySync,
} = $provider.tools.fs

const { getPath } = $provider.tools.paths

export class File {
  name

  extension

  directory

  mimetype

  size = -1

  exists = false

  md5

  dataUrl = ''

  /**
   *
   * @param {*} filepath
   * @param {*} dataURL
   */
  static async fromDataURL(filepath, dataURL) {
    await writeDataUrl(filepath, dataURL)
    return new this(filepath)
  }

  /**
   *
   * @param {*} filepath
   */
  static fromPath(filepath) {
    return new this(filepath)
  }

  /**
   *
   */
  static async fromUrl(url) {
    const filepath = await downloadAsync(url, {
      directory: getPath('temp'),
    })

    return new this(filepath)
  }

  constructor(filepath) {
    this.reload(filepath)
  }

  /**
   *
   * @param {string} [filepath]
   */
  reload(filepath) {
    if (isNil(filepath)) {
      // eslint-disable-next-line no-param-reassign
      filepath = this.path
    }

    const info = getInfo(filepath)

    this.name = info.name
    this.extension = info.ext
    this.directory = info.dir
    this.mimetype = info.mimetype
    this.size = info.size
    this.exists = info.exists
    this.md5 = info.md5

    this.readAsDataUrl().then((data) => {
      this.dataUrl = data
      return true
    }).catch(() => { })
  }

  /**
   * @type {string}
   */
  get fullname() {
    return `${this.name}${this.extension}`
  }

  /**
   * @type {string}
   */
  get path() {
    return join(this.directory, this.fullname)
  }

  /**
   *
   */
  unlink() {
    if (!this.exists) {
      return
    }

    unlinkSync(this.path)
    this.reload()
  }

  /**
   *
   */
  async readAsDataUrl() {
    if (!this.exists) {
      return null
    }

    const data = await read(this.path, 'base64')
    return `data:${this.mimetype};base64,${data}`
  }

  /**
   *
   */
  async writeDataUrl(data) {
    await writeDataUrl(this.path, data)
    this.reload()
  }

  /**
   *
   * @param {*} destination
   */
  copy(destination) {
    return copySync(this.path, destination)
  }
}
