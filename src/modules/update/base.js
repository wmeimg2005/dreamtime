// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import _ from 'lodash'
import axios from 'axios'
import compareVersions from 'compare-versions'
import Deferred from 'deferred'
import swal from 'sweetalert'
import filesize from 'filesize'
import dream from '../dream'

const debug = require('debug').default('app:modules:update')

const API_URL = 'https://api.github.com/repos/'

export default class {
  constructor() {
    // Can we update this project?
    this.enabled = false

    // Is there an update available?
    this.available = false

    // We are not updating
    this._resetUpdating()

    this.downloadBus = undefined

    this.current = {
      tag_name: 'v0.0.0',
    }

    this.latest = {
      tag_name: 'v0.0.0',
    }

    this.http = axios.create({
      baseURL: API_URL,
    })
  }

  /**
   * Returns if this provider is activated
   */
  can() {
    return false
  }

  /**
   * Returns the code name of the project.
   * It is usually the lowercase name
   */
  getName() {
    return undefined
  }

  /**
   * Returns the current version of the project
   */
  async getCurrentVersion() {
    return 'v0.0.0'
  }

  /**
   *
   * @param {string} latest
   * @param {string} current
   * @return {boolean}
   */
  async isAvailable(latest) {
    const currentVersion = await this.getCurrentVersion()
    return compareVersions.compare(latest, currentVersion, '>')
  }

  /**
   * Returns the domain and repository of the project in Github.
   * Example: private-dreamnet/dreamtime
   */
  getGithubRepository() {
    return undefined
  }

  /**
   *
   */
  getUpdateFileName() {
    const url = this.getUpdateDownloadURLs()[0]
    return url.substring(url.lastIndexOf('/') + 1)
  }

  /**
   *
   */
  getUpdatePlatform() {
    return $tools.utils.platform({
      macos: 'macos',
      windows: 'windows',
      linux: 'ubuntu',
    })
  }

  /**
   * Returns the URLs where the latest version can be downloaded
   */
  getUpdateDownloadURLs() {
    const platform = this.getUpdatePlatform()

    let urls
    let asset

    try {
      urls = _.clone($nucleus.releases[`${this.getName()}`][`${this.latest.tag_name}`])
    } catch (err) {
      urls = []
    }

    if (_.isPlainObject(urls)) {
      urls = _.clone(urls[platform])
    }

    if (_.isNil(urls)) {
      urls = []
    }

    if (this.latest.assets.length === 1) {
      // eslint-disable-next-line prefer-destructuring
      asset = this.latest.assets[0]
    } else {
      asset = _.find(this.latest.assets, (asset) => asset.name.includes(platform))
    }

    if (!_.isNil(asset)) {
      urls.push(asset.browser_download_url)
    }

    urls = urls.filter((item) => _.startsWith(item, 'http'))

    return urls
  }

  /**
   *
   * @param {Array} releases
   */
  getLatestRelease(releases) {
    return releases[0]
  }

  /**
   * Set information about the update in progress
   *
   * @param {string} text
   * @param {number} progress
   */
  _setUpdating(text = '', progress = -1) {
    this.updating.active = true
    this.updating.text = text

    if (progress >= 0) {
      this.updating.progress = progress
    }
  }

  /**
   * Restart the information about the update in progress
   * (no longer updating)
   */
  _resetUpdating() {
    this.updating = {
      active: false,
      text: undefined,

      progress: 0,
      mbWritten: 0,
      mbTotal: 0,
    }
  }

  /**
   * Fetch releases information
   */
  async fetch() {
    // Indicates if the releases information is available
    this.enabled = false

    if (!navigator.onLine) {
      // Offline mode
      return
    }

    if (!this.can()) {
      console.warn(`Update provider is deactivated`)
      return
    }

    try {
      await this.fetchFromAPI()

      this.enabled = true

      debug(`${this.getName()} - Update provider initialized!`, {
        provider: this,
        name: this.getName(),
        currentVersion: await this.getCurrentVersion(),
        downloadURLs: this.getUpdateDownloadURLs(),
        fileName: this.getUpdateFileName(),
        platform: this.getUpdatePlatform(),
      })
    } catch (err) {
      $rollbar.warn(err, {
        project: this.getName(),
      })

      console.warn(`${this.getName()}: Error at fetch releases`, err)

      this.enabled = false
    }
  }

  /**
   *
   */
  async fetchFromAPI() {
    const response = await this.http.get(
      `${this.getGithubRepository()}/releases`,
    )

    // Stable versions only
    const releases = _.filter(response.data, {
      draft: false,
      prerelease: false,
    })

    if (releases.length === 0) {
      return
    }

    const currentVersion = await this.getCurrentVersion()

    // eslint-disable-next-line
    this.latest = this.getLatestRelease(releases)
    this.current = _.find(releases, { tag_name: currentVersion })
    this.available = await this.isAvailable(this.latest.tag_name)

    // this.available = true

    if ($settings.notifications.update && this.available) {
      this.sendNotification()
    }
  }

  /**
   * Download the latest software version
   */
  async download() {
    if (!navigator.onLine) {
      swal({
        icon: 'error',
        title: 'Update failed',
        text: `Please verify that you are connected to the Internet and that ${dream.name} has permission to connect.`,
      })

      return false
    }

    const downloadURLs = this.getUpdateDownloadURLs()
    let filePath

    for (const url of downloadURLs) {
      this._setUpdating('Downloading...', 0)

      // Try to download it from each mirror
      try {
        // eslint-disable-next-line no-await-in-loop
        filePath = await this._downloadFrom(url)

        if (_.isNil(filePath)) {
          // Apparently the download has been canceled
          this._resetUpdating()
          return false
        }

        if (!$tools.fs.exists(filePath)) {
          throw new Error('The update has not been downloaded!')
        }

        const stats = $tools.fs.stats(filePath)
        const size = filesize(stats.size, { exponent: 2, output: 'object' })

        if (size.value < 20) {
          throw new Error('The update is corrupt!')
        }

        // Download completed, now install
        this._setUpdating('Installing...', 0)

        // eslint-disable-next-line no-await-in-loop
        await this.install(filePath)

        return true
      } catch (err) {
        $rollbar.warn(err, { url, provider: this })
        console.warn(`Error downloading/installing from the URL: ${url}`, err)

        continue
      }
    }

    swal({
      icon: 'error',
      title: 'Update failed',
      text: `There was a problem trying to download the update, please verify that you are connected to the Internet. If the problem persists try to configure or temporarily disable your Firewall/Antivirus/VPN.`,
    })

    this._resetUpdating()

    return false
  }

  /**
   *
   * @param {string} url
   */
  _downloadFrom(url) {
    debug(`Trying to update from the URL: ${url}`)

    const deferred = new Deferred()

    this.downloadBus = $tools.fs.download(url)

    this.downloadBus.on('progress', (payload) => {
      this.updating.progress = payload.progress
      this.updating.mbTotal = payload.mbTotal
      this.updating.mbWritten = payload.mbWritten
      // debug(`Progress: ${progress}`)
    })

    this.downloadBus.on('end', (filePath) => {
      debug('Download finished!', {
        filePath,
      })

      this.downloadBus = undefined
      deferred.resolve(filePath)
    })

    this.downloadBus.on('error', (err) => {
      this.downloadBus = undefined
      deferred.reject(err)
    })

    return deferred.promise()
  }

  /**
   * Cancel the update in progress
   */
  cancel() {
    if (_.isNil(this.downloadBus)) {
      return
    }

    this.downloadBus.emit('cancel')
  }

  /**
   * Install the downloaded update
   *
   * @param {string} filePath
   */
  /* eslint-disable-next-line */
  async install(filePath) {
    // Custom
  }

  /**
   * Send a notification indicating update available
   */
  sendNotification() { }
}
