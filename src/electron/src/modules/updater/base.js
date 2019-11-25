// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import {
  isNil, isArray, isPlainObject, clone, find,
  startsWith, filter, get, isEmpty,
} from 'lodash'
import axios from 'axios'
import compareVersions from 'compare-versions'
import deferred from 'deferred'
import filesize from 'filesize'
import delay from 'delay'
import { dialog } from 'electron'
import { platform } from 'electron-util'
import { basename } from 'path'
import { nucleus } from '../services'
import { system } from '../tools'
import { getPath } from '../tools/paths'
import { existsSync, statSync, download } from '../tools/fs'
import { AppError } from '../app-error'

const logplease = require('logplease')

const extRegex = /(?:\.([^.]+))?$/

/**
 * todo: don't just depend on github
 * @type {string}
 */
const GITHUB_API = 'https://api.github.com/repos'

export class BaseUpdater {
  /**
   * @type {boolean}
   */
  enabled = false

  /**
   * @type {logplease.Logger}
   */
  _logger

  /**
   * @type {axios.AxiosInstance}
   */
  _http

  /**
   * @type {Object}
   */
  latest = {}

  /**
   * @type {Object}
   */
  latestCompatible = {}

  /**
   * @type {string}
   */
  _currentVersion

  /**
   * @type {Array}
   */
  downloadUrls = []

  /**
   * @type {import('js-event-bus')}
   */
  _downloadBus

  /**
   * @type {Object}
   */
  update = {
    active: false,
    status: null,
    progress: 0,
    written: -1,
    total: -1,
  }

  /**
   * @type {string}
   */
  get can() {
    return !isNil(this.name) && !isNil(this.githubRepo)
  }

  /**
   * @type {string}
   */
  get name() {
    return null
  }

  /**
   * @type {string}
   */
  get latestVersion() {
    // eslint-disable-next-line camelcase
    return this.latest ?.tag_name || 'v0.0.0'
  }

  /**
   * @type {string}
   */
  get latestCompatibleVersion() {
    // eslint-disable-next-line camelcase
    return this.latestCompatible ?.tag_name || 'v0.0.0'
  }

  /**
   * @type {string}
   */
  get currentVersion() {
    return this._currentVersion
  }

  /**
   * @type {boolean}
   */
  get available() {
    return compareVersions.compare(this.latestCompatibleVersion, this.currentVersion, '>')
  }

  /**
   * @type {string}
   */
  get githubRepo() {
    return get(nucleus, `projects.${this.name}.repository.github`)
  }

  /**
   * @type {string}
   */
  get filename() {
    if (this.downloadUrls.length === 0) {
      return null
    }

    for (const url of this.downloadUrls) {
      const filename = basename(url).split('?')[0].split('#')[0]

      if (isEmpty(filename) || isNil(extRegex.exec(filename)[1])) {
        // empty or no filename in url
        continue
      }

      return filename
    }

    return null
  }

  /**
   * @type {string}
   */
  get platform() {
    return platform({
      macos: 'macos',
      windows: 'windows',
      linux: 'linux',
    })
  }

  constructor() {
    this._logger = logplease.create(`updater:${this.name}`)
  }

  /**
   *
   */
  async setup() {
    this.enabled = false

    if (!system.online) {
      this._logger.warn('Updater disabled due of Internet connection.')
      return
    }

    if (!nucleus.enabled) {
      this._logger.warn('Updater disabled due of nucleus service.')
      return
    }

    if (!this.can) {
      this._logger.warn('Updater disabled due of requirements.')
      return
    }

    try {
      this._http = axios.create({
        baseURL: `${GITHUB_API}/${this.githubRepo}`,
        timeout: 3000,
      })

      await this._fetchReleases()

      this.downloadUrls = this._getDownloadUrls()

      this._logger.info(`Current: ${this.currentVersion} - Latest Compatible: ${this.latestCompatibleVersion}`)
      this.enabled = true
    } catch (err) {
      this._logger.warn('Fetching releases failed!', err)
    }

    if (this.available) {
      this.sendNotification()
    }
  }

  /**
   *
   * @param {*} releases
   */
  _getLatestCompatible(releases) {
    return releases[0]
  }

  /**
   *
   */
  _getDownloadUrls() {
    let urls
    let asset

    try {
      urls = clone(nucleus.releases[this.name][this.latestVersion])
    } catch (err) {
      // not the best way, but it works
      urls = []
    }

    if (isPlainObject(urls)) {
      urls = urls[this.platform]
    }

    if (!isArray(urls)) {
      urls = []
    }

    if (this.latest.assets.length === 1) {
      [asset] = this.latest.assets
    } else {
      asset = find(this.latest.assets, (asset) => asset.name.includes(platform))
    }

    if (!isNil(asset)) {
      // github download url at the end, it doesn't always work.
      urls.push(asset.browser_download_url)
    }

    // for now we use only the http/https protocol
    // todo: ipfs
    urls = urls.filter((item) => startsWith(item, 'http'))

    return urls
  }

  /**
   *
   * @param {string} status
   * @param {number} progress
   */
  _setUpdateProgress(status) {
    this.update.active = true
    this.update.status = status
    this.update.progress = -1
  }

  /**
   *
   */
  _stopUpdateProgress() {
    this.update = {
      active: false,
      status: null,
      progress: 0,
      written: 0,
      total: 0,
    }
  }

  /**
   *
   */
  async _fetchReleases() {
    const response = await this._http.get('/releases')

    // only final releases
    const releases = filter(response.data, {
      draft: false,
      prerelease: false,
    })

    if (releases.length === 0) {
      throw new AppError('No releases found!', { level: 'warning' })
    }

    [this.latest] = releases
    this.latestCompatible = this._getLatestCompatible(releases)

    if (isNil(this.latestCompatible)) {
      throw new AppError('No compatible release found!', { level: 'warning ' })
    }
  }

  /**
   *
   */
  async start() {
    try {
      let filepath = getPath('downloads', this.filename)

      if (existsSync(filepath)) {
        const useLocal = dialog.showMessageBoxSync({
          type: 'question',
          buttons: ['Yes', 'No, download it again'],
          defaultId: 0,
          title: 'Update.',
          message: 'The update file was found on your computer. Do you want to use it?',
        })

        if (useLocal === 0) {
          await this._install(filepath)
          return
        }
      }

      filepath = await this._download()

      await this._install(filepath)
    } finally {
      this._stopUpdateProgress()
    }
  }

  /**
   *
   */
  async _install(filepath) {
    try {
      this._setUpdateProgress('Installing...')

      // avoid opening it while it is in use
      await delay(1500)

      await this.install(filepath)
    } catch (err) {
      this._logger.warn(`Error installing update from: ${filepath}`, err)
      throw new AppError(err, { title: 'Update installation failed.', level: 'warning' })
    }
  }

  /**
   *
   */
  async _download() {
    if (!system.online) {
      throw new AppError('You need to be connected to the Internet to download the updates.', { title: 'Update download failed.', level: 'warning' })
    }

    let filepath

    for (const url of this.downloadUrls) {
      this._setUpdateProgress('Downloading...')

      try {
        // eslint-disable-next-line no-await-in-loop
        filepath = await this._downloadFrom(url)

        if (isNil(filepath)) {
          // cancelled by user
          this._stopUpdateProgress()
          return null
        }

        return filepath
      } catch (err) {
        this._logger.warn(`Error downloading update from: ${url}`, err)
        continue
      }
    }

    throw new AppError('Please download the update manually or verify the configuration of your VPN/Firewall.', { title: 'Update download failed.', level: 'warning' })
  }

  /**
   *
   * @param {string} url
   */
  _downloadFrom(url) {
    this._logger.info(`Downloading update from: ${url}`)
    const def = deferred()

    this._downloadBus = download(url, {
      filename: this.filename,
    })

    this._downloadBus.on('progress', (payload) => {
      this.update.progress = payload.progress
      this.update.total = payload.mbTotal
      this.update.written = payload.mbWritten
    })

    this._downloadBus.on('error', (err) => {
      this._downloadBus = null
      def.reject(err)
    })

    this._downloadBus.on('end', (filepath) => {
      const stats = statSync(filepath)
      const size = filesize(stats.size, { exponent: 2, output: 'object' })

      if (size.value < 20) {
        // todo: better corrupt detection
        def.reject(new AppError('The file is corrupt.', { title: 'Update download failed.', level: 'warning' }))
      }

      this._downloadBus = null
      def.resolve(filepath)
    })

    return def.promise
  }

  /**
   *
   */
  cancel() {
    if (isNil(this._download)) {
      return
    }

    this._downloadBus.emit('cancel')
  }

  /**
   *
   * @param {string} filepath
   */
  // eslint-disable-next-line no-empty-function
  async install(filepath) { }

  /**
   *
   */
  sendNotification() { }
}
