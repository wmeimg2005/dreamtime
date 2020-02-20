/* eslint-disable max-classes-per-file */
/* eslint-disable no-return-await */
/* eslint-disable no-console */
// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2020.

const { Octokit } = require('@octokit/rest')
const mime = require('mime-types')
const {
  startsWith, truncate, get, find, isString,
} = require('lodash')
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const FormData = require('form-data')
const Cryptr = require('cryptr')
const ndjson = require('ndjson-parse')
const pkg = require('../package.json')

// DEBUG
/*
process.env.SECRET_KEY = ''
process.env.GITHUB_REF = 'refs/tags/v1.4.4'
process.env.GITHUB_SHA = 'dbd635f415ce076cf99831271ba531bb258e3196'
process.env.BUILD_PLATFORM = 'windows'
process.env.BUILD_EXTENSION = 'exe'
process.env.DREAMLINK_TOKEN = ''
process.env.PINATA_KEY = ''
process.env.PINATA_SECRET = ''
process.env.CODEBERG_TOKEN = ''
process.env.ANTOPIE_TOKEN = ''
process.env.SPIP_TOKEN = ''
process.env.TEKNIK_TOKEN = ''
*/

// Settings
const GITHUB_ORG = 'dreamnettech'
const GITHUB_REPO = 'dreamtime'
const VERSION = `v${pkg.version}`

// Encryption key
const cryptr = new Cryptr(process.env.SECRET_KEY)

// Octokit
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

// Upload attempts
let attempts = 0

// Dev Helper
const Helper = {
  output: {
    commands: [],
    urls: [],
  },

  get isTagRelease() {
    return startsWith(process.env.GITHUB_REF, 'refs/tags')
  },

  get tagName() {
    return this.isTagRelease ? process.env.GITHUB_REF.split('/')[2] : truncate(process.env.GITHUB_SHA, { length: 7, omission: '' })
  },

  get isEarly() {
    return this.tagName.includes('early')
  },

  /**
   *
   * @param {string} platform
   * @param {string} url
   */
  addUrl(url) {
    this.output.urls.push(url)
  },

  /**
   *
   * @param {string} hash
   * @param {string} fileName
   */
  addCommand(hash, fileName) {
    this.output.commands.push(`ipfs files cp /ipfs/${hash} /DreamNet/Public/Projects/DreamTime/Releases/${VERSION}/${fileName}`)
  },
}

/**
 * GitHub Helper
 */
const GitHub = {
  async getRelease() {
    try {
      const response = await octokit.repos.getReleaseByTag({
        owner: GITHUB_ORG,
        repo: GITHUB_REPO,
        tag: Helper.tagName,
      })

      return response.data.upload_url
    } catch (error) {
      if (error.status !== 404) {
        throw error
      }

      console.log(`Creating release for tag: ${Helper.tagName}`)
      return await this.createRelease()
    }
  },

  async createRelease() {
    try {
      const response = await octokit.repos.createRelease({
        owner: GITHUB_ORG,
        repo: GITHUB_REPO,
        tag_name: Helper.tagName,
        name: VERSION,
        prerelease: true,
        draft: false,
      })

      return response.data.upload_url
    } catch (error) {
      console.warn(error)

      if (attempts <= 3) {
        attempts += 1
        console.log(`[GitHub] Retrying ${attempts}/3...`)

        return await this.getRelease()
      }

      return null
    }
  },

  async upload(release) {
    if (!process.env.GITHUB_TOKEN) {
      console.warn('No GitHub Token')
      return null
    }

    try {
      const url = await this.getRelease()

      console.log(`[GitHub] Uploading ${release.fileName} to ${url}`)

      const response = await octokit.repos.uploadReleaseAsset({
        url,
        headers: {
          'content-length': release.fileStat.size,
          'content-type': mime.lookup(release.filePath),
        },
        name: release.fileName,
        data: fs.createReadStream(release.filePath),
      })

      return response
    } catch (err) {
      console.warn('[GitHub] Error!', err)
      return null
    }
  },
}

/**
 * Gitea Helper
 */
class Gitea {
  constructor(url, token, owner = 'dreamnet', repo = 'dreamtime') {
    this.url = url
    this.token = token
    this.owner = owner
    this.repo = repo

    this.axios = axios.create({
      baseURL: `${url}/api/v1`,
      timeout: 5000,
      headers: {
        Authorization: `token ${token}`,
      },
    })
  }

  async getRelease() {
    const response = await this.axios.get(`/repos/${this.owner}/${this.repo}/releases`)

    const release = find(response.data, { tag_name: Helper.tagName })

    if (!release) {
      return await this.createRelease()
    }

    return release.id
  }

  async createRelease() {
    console.log(`[${this.url}] Creating release for ${Helper.tagName}`)

    try {
      const response = await this.axios.post(`/repos/${this.owner}/${this.repo}/releases`, {
        tag_name: Helper.tagName,
        name: VERSION,
        prerelease: true,
        draft: false,
      })

      return response.data.id
    } catch (error) {
      console.warn(error)
      console.log(`[${this.url}] Retrying...`)

      return await this.getRelease()
    }
  }

  async upload(release) {
    if (!this.url || !this.token) {
      console.warn('Gitea: No valid information.')
      return null
    }

    try {
      const releaseId = await this.getRelease()

      console.log(`[${this.url}] Uploading ${release.fileName} to release ${releaseId}`)

      const formData = new FormData()
      formData.append('attachment', fs.createReadStream(release.filePath), { filename: this.fileName })

      const response = await this.axios.post(`/repos/${this.owner}/${this.repo}/releases/${releaseId}/assets`, formData, {
        params: {
          name: release.fileName,
        },
        headers: formData.getHeaders(),
        timeout: (15 * 60 * 1000),
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      })

      if (!release.fileName.includes('.zip')) {
        Helper.addUrl(response.data.browser_download_url)
      }

      return response.data
    } catch (err) {
      const status = get(err, 'response.status')

      if (status === 400) {
        return null
      }

      console.warn(`[${this.url}] Error!`, {
        code: err.code,
        status,
        statusText: get(err, 'response.statusText'),
        data: get(err, 'response.data'),
        err: status ? null : err,
      })

      if (attempts < 3) {
        attempts += 1
        console.log(`[${this.url}] Retrying ${attempts}/3...`)

        return await this.upload(release)
      }

      return null
    }
  }
}

class Release {
  constructor(extension) {
    this.enabled = false

    this.extension = extension

    this.fileName = `DreamTime-${VERSION}-${process.env.BUILD_PLATFORM}.${this.extension}`

    this.filePath = path.resolve(__dirname, '../../dist', this.fileName)

    if (fs.existsSync(this.filePath)) {
      this.fileStat = fs.statSync(this.filePath)
      this.enabled = true
    } else {
      console.log('No release found!', {
        filePath: this.filePath,
        fileName: this.fileName,
      })
    }
  }

  /**
   * @param {string} url
   * @param {object} customHeaders
   */
  async uploadTo(url, customHeaders = {}) {
    try {
      const formData = new FormData()
      formData.append('file', fs.createReadStream(this.filePath), { filename: this.fileName })

      const headers = formData.getHeaders(customHeaders)

      console.log(`[${url}] Uploading ${this.fileName}`)

      let response = await axios.post(url, formData, {
        headers,
        timeout: (15 * 60 * 1000),
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      })

      response = response.data

      return response
    } catch (err) {
      const status = get(err, 'response.status')

      if (status === 502) {
        return null
      }

      console.warn(`[${url}] Error!`, {
        code: err.code,
        status,
        statusText: get(err, 'response.statusText'),
        data: get(err, 'response.data'),
        err: status ? null : err,
      })

      if (attempts < 3) {
        attempts += 1
        console.log(`[${url}] Retrying ${attempts}/3...`)

        return await this.uploadTo(url, customHeaders)
      }

      return null
    }
  }

  async uploadToDreamLink() {
    if (!process.env.DREAMLINK_TOKEN) {
      console.warn('No DreamLink token.')
      return
    }

    let response = await this.uploadTo('https://ipfs.valeria.dreamnet.tech/api/v0/add', {
      Authorization: `Basic ${process.env.DREAMLINK_TOKEN}`,
    })

    if (response) {
      if (isString(response)) {
        response = ndjson(response)

        Helper.addCommand(response[response.length - 1].Hash, this.fileName)
      } else {
        Helper.addCommand(response.Hash, this.fileName)
      }

      if (this.extension !== 'zip') {
        Helper.addUrl(`https://link.dreamnet.tech/ipfs/CID/${this.fileName}`)
      }
    }
  }

  async uploadToInfura() {
    let response = await this.uploadTo('https://ipfs.infura.io:5001/api/v0/add')

    if (response && this.extension !== 'zip') {
      if (isString(response)) {
        response = ndjson(response)

        Helper.addUrl(`https://ipfs.infura.io/ipfs/${response[response.length - 1].Hash}`)
      } else {
        Helper.addUrl(`https://ipfs.infura.io/ipfs/${response.Hash}`)
      }
    }
  }

  async uploadToPinata() {
    if (this.extension === 'zip') {
      return
    }

    if (!process.env.PINATA_KEY || !process.env.PINATA_SECRET) {
      console.warn('No Pinata tokens.')
      return
    }

    const response = await this.uploadTo('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      pinata_api_key: process.env.PINATA_KEY,
      pinata_secret_api_key: process.env.PINATA_SECRET,
    })

    if (response) {
      Helper.addUrl(`https://gateway.pinata.cloud/ipfs/${response.IpfsHash}`)
    }
  }

  async uploadToGit() {
    await GitHub.upload(this)

    if (!Helper.isEarly) {
      const codeberg = new Gitea('https://codeberg.org', process.env.CODEBERG_TOKEN)
      const antopie = new Gitea('https://code.antopie.org', process.env.ANTOPIE_TOKEN)
      const spip = new Gitea('https://git.spip.net', process.env.SPIP_TOKEN, 'kolessios')
      const teknik = new Gitea('https://git.teknik.io', process.env.TEKNIK_TOKEN)

      await codeberg.upload(this)

      await antopie.upload(this)

      await spip.upload(this)

      await teknik.upload(this)
    }
  }

  async upload() {
    if (!this.enabled) {
      return
    }

    if (Helper.isTagRelease) {
      await this.uploadToGit()
    }

    await this.uploadToInfura()
    await this.uploadToPinata()
    await this.uploadToDreamLink()
  }
}

process.on('unhandledRejection', (err) => {
  throw err
})

const installer = new Release(process.env.BUILD_EXTENSION)
const portable = new Release('zip')

async function main() {
  try {
    await installer.upload()
    await portable.upload()
  } catch (err) {
    console.error(err)
  } finally {
    if (Helper.isEarly) {
      console.log(cryptr.encrypt(JSON.stringify(Helper.output)))
    } else {
      console.log(Helper.output)
    }
  }
}

main()
