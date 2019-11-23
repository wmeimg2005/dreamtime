// eslint-disable-next-line lodash/import-scope
import _ from 'lodash'
import path from 'path'

/* eslint-disable-next-line */
const debug = require('debug').default('app:modules:file')

const {
  writeDataUrl, downloadAsync, getInfo, unlinkSync,
  read, copySync,
} = $provider.tools.fs

const { getPath } = $provider.tools.paths

export default class File {
  constructor(path) {
    this.reload(path)
  }

  /**
   *
   * @param {*} path
   * @param {*} dataURL
   */
  static async fromDataURL(path, dataURL) {
    await writeDataUrl(path, dataURL)
    return new this(path)
  }

  /**
   *
   * @param {*} path
   */
  static fromPath(path) {
    return new this(path)
  }

  /**
   *
   */
  static async fromURL(url) {
    const filePath = await downloadAsync(url, {
      directory: getPath('temp'),
    })

    return new this(filePath)
  }

  /**
   *
   * @param {*} path
   */
  update(path) {
    this.reload(path)
  }

  /**
   *
   * @param {*} path
   */
  reload(path) {
    let filePath = path

    if (_.isNil(path)) {
      filePath = this.getPath()
    }

    const info = getInfo(filePath)

    this.name = info.name
    this.ext = info.ext
    this.dir = info.dir
    this.mimetype = info.mimetype
    this.size = info.size
    this._exists = info.exists
  }

  /**
   *
   */
  getPath() {
    return path.join(this.dir, `${this.name}${this.ext}`)
  }

  /**
   *
   */
  getName() {
    return this.name
  }

  /**
   *
   */
  getExt() {
    return this.ext
  }

  /**
   *
   */
  getDir() {
    return this.dir
  }

  /**
   *
   */
  getMimetype() {
    return this.mimetype
  }

  /**
   *
   */
  getSize() {
    return this.size
  }

  /**
   *
   */
  exists() {
    return this._exists
  }

  /**
   *
   */
  remove() {
    if (!this.exists()) {
      return
    }

    unlinkSync(this.getPath())
    this.reload()
  }

  /**
   *
   */
  async readAsDataURL() {
    if (!this.exists()) {
      return undefined
    }

    const data = await read(this.getPath(), 'base64')
    return `data:${this.getMimetype()};base64,${data}`
  }

  /**
   *
   */
  async writeDataURL(dataURL) {
    await writeDataUrl(this.getPath(), dataURL)
    this.reload()
  }

  /**
   *
   * @param {*} targetPath
   */
  async copy(targetPath) {
    await copySync(this.getPath(), targetPath)
  }
}
