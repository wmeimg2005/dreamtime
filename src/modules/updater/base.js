// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import {
  isNil, isArray, isPlainObject, find,
  startsWith, filter, isEmpty,
} from 'lodash'
import axios from 'axios'
import compareVersions from 'compare-versions'
import deferred from 'deferred'
import filesize from 'filesize'
import delay from 'delay'
import { basename } from 'path'
import { dreamtrack } from '../services'
import { Consola } from '../consola'

const { system } = $provider
const { getPath } = $provider.paths
const { existsSync, statSync, download } = $provider.fs
const { dialog, app } = $provider.api
const { platform } = $provider.util

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
   * @type {Consola}
   */
  consola

  /**
   * @type {axios.AxiosInstance}
   */
  http

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
  _currentVersion = 'v0.0.0'

  get currentVersion() {
    return this._currentVersion
  }

  /**
   * @type {Array}
   */
  downloadUrls = []

  /**
   * @type {EventEmitter}
   */
  downloadEvents

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
  get displayName() {
    return dreamtrack.get(`projects.${this.name}.about.title`, this.name)
  }

  /**
   * @type {string}
   */
  get latestVersion() {
    // eslint-disable-next-line camelcase
    return this.latest?.tag_name || 'v0.0.0'
  }

  /**
   * @type {string}
   */
  get latestCompatibleVersion() {
    // eslint-disable-next-line camelcase
    return this.latestCompatible?.tag_name || 'v0.0.0'
  }

  /**
   * @type {boolean}
   */
  get available() {
    if (!this.enabled) {
      return false
    }

    return compareVersions.compare(this.latestCompatibleVersion, this.currentVersion, '>')
  }

  /**
   * @type {string}
   */
  get githubRepo() {
    return dreamtrack.get(`projects.${this.name}.repository.github`)
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
      linux: 'ubuntu',
    })
  }

  /**
   *
   */
  constructor() {
    this.consola = Consola.create(`updater:${this.name}`)
  }

  /**
   *
   */
  async setup(required = false) {
    this.enabled = false

    if (!required) {
      if (!system.online) {
        this.consola.warn('No internet connection.')
        return
      }

      if (!dreamtrack.enabled) {
        this.consola.warn('No connection with DreamTrack.')
        return
      }
    }

    if (!this.can) {
      this.consola.warn('Disabled.')
      return
    }

    try {
      this.http = axios.create({
        baseURL: `${GITHUB_API}/${this.githubRepo}`,
        timeout: 6000,
      })

      await this._fetchReleases()
      this.consola.info(`Current: ${this.currentVersion} - Latest: ${this.latestCompatibleVersion}`)

      this.enabled = true

      this.refresh()

      if (this.available) {
        this.sendNotification()
      }
    } catch (err) {
      this.consola.warn('Unable to fetch the latest version!', err)

      if (required) {
        dialog.showMessageBoxSync({
          type: 'error',
          title: 'Connect to Internet.',
          message: 'There was a problem getting the latest version of the components needed to use DreamTime. Please make sure you are connected to the Internet just for this time and try again.',
        })

        // Close.
        app.quit()
      }
    }
  }

  refresh() {
    if (!this.enabled) {
      return
    }

    this.downloadUrls = this._getDownloadUrls()
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
      urls = dreamtrack.get(['projects', this.name, 'releases', this.latestVersion, 'urls'])
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
      asset = find(this.latest.assets, (asset) => asset.name.includes(this.platform))
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
    const response = await this.http.get('/releases')

    // only final releases
    const releases = filter(response.data, {
      draft: false,
      prerelease: false,
    })

    if (releases.length === 0) {
      throw new Exception('Github has returned that there are no releases!')
    }

    // eslint-disable-next-line prefer-destructuring
    this.latest = releases[0]
    this.latestCompatible = this._getLatestCompatible(releases)

    if (isNil(this.latestCompatible)) {
      throw new Exception('Unable to fetch the latest compatible version.')
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
          title: 'Update.',
          message: 'The update file was found on your computer. Do you want to use it?',
        })

        if (useLocal === 0) {
          await this._install(filepath)
          return
        }
      }

      filepath = await this._download()

      if (!isNil(filepath)) {
        await this._install(filepath)
      }
    } finally {
      this._stopUpdateProgress()
    }
  }

  /**
   *
   */
  async _install(filepath) {
    try {
      this._setUpdateProgress('installing')

      // Avoid opening it while it is in use.
      await delay(3000)

      await this.install(filepath)
    } catch (err) {
      throw new Exception('The installation failed.', 'There was a problem trying to install the downloaded file, please try again.', err)
    }
  }

  /**
   *
   */
  async _download() {
    if (!system.online) {
      throw new Warning('Update download failed.', 'You need an Internet connection to download the update.')
    }

    let filepath

    for (const url of this.downloadUrls) {
      this._setUpdateProgress('downloading')

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
        this.consola.warn(`Unable to download update from: ${url}`, err).report()
        continue
      }
    }

    throw new Warning('Unable to download update.', 'Please download the update manually or verify the configuration of your VPN/Firewall.')
  }

  /**
   *
   * @param {string} url
   */
  _downloadFrom(url) {
    this.consola.info(`Downloading update from: ${url}`)
    const def = deferred()

    this.downloadEvents = download(url, {
      filename: this.filename,
    })

    this.downloadEvents.on('progress', (payload) => {
      this.update.progress = (payload.progress * 100).toFixed(2)
      this.update.total = payload.total
      this.update.written = payload.written
    })

    this.downloadEvents.on('error', (err) => {
      this.downloadEvents = null
      def.reject(err)
    })

    this.downloadEvents.on('finish', (filepath) => {
      const stats = statSync(filepath)
      const size = filesize(stats.size, { exponent: 2, output: 'object' })

      if (size.value < 20) {
        // todo: better corrupt detection
        def.reject(new Warning('Unable to download update.', 'The file is corrupt.'))
      }

      this.downloadEvents = null
      def.resolve(filepath)
    })

    this.downloadEvents.on('cancelled', () => {
      this.downloadEvents = null
      def.resolve()
    })

    return def.promise
  }

  /**
   *
   */
  cancel() {
    if (isNil(this.downloadEvents)) {
      return
    }

    this.downloadEvents.emit('cancel')
  }

  /**
   *
   * @param {string} filepath
   */
  // eslint-disable-next-line no-unused-vars, no-empty-function
  async install(filepath) { }

  /**
   *
   */
  sendNotification() { }
}
