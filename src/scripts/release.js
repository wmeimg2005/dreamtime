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
const { startsWith, truncate, get } = require('lodash')
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const FormData = require('form-data')
const Cryptr = require('cryptr')
const ndjson = require('ndjson-parse')
const pkg = require('../package.json')

// Settings
const GITHUB_ORG = 'dreamnettech'
const GITHUB_REPO = 'dreamtime'
const VERSION = `v${pkg.version}`

// Encryption key
const cryptr = new Cryptr(process.env.SECRET_KEY)

// Octokit
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

// Dev Output
const output = {
  responses: [],
  commands: [],
  urls: {
    windows: [],
    ubuntu: [],
    macos: [],
  },
}

/**
 *
 * @param {*} payload
 */
function addResponse(payload) {
  output.responses.push(payload)
}

/**
 *
 * @param {string} platform
 * @param {string} url
 */
function addUrl(url, fileName) {
  let platform

  if (fileName.includes('windows')) {
    platform = 'windows'
  }

  if (fileName.includes('ubuntu')) {
    platform = 'ubuntu'
  }

  if (fileName.includes('macos')) {
    platform = 'macos'
  }

  output.urls[platform].unshift(url)
}

/**
 *
 * @param {string} hash
 * @param {string} fileName
 */
function addCommand(hash, fileName) {
  output.commands.push(`ipfs files cp /ipfs/${hash} /DreamNet/Public/Projects/DreamTime/Releases/${VERSION}/${fileName}`)

  addUrl(`https://link.dreamnet.tech/ipfs/CID/${fileName}`, fileName)
}

/**
 * GitHub Helper
 */
const GitHub = {
  get isTagRelease() {
    return startsWith(process.env.GITHUB_REF, 'refs/tags')
  },

  get tagName() {
    return this.isTagRelease ? process.env.GITHUB_REF.split('/')[2] : truncate(process.env.GITHUB_SHA, { length: 7, omission: '' })
  },

  async getRelease() {
    try {
      const response = await octokit.repos.getReleaseByTag({
        owner: GITHUB_ORG,
        repo: GITHUB_REPO,
        tag: this.tagName,
      })

      return response.data.upload_url
    } catch (error) {
      if (error.status !== 404) {
        throw error
      }

      console.log(`Creating release for tag: ${this.tagName}`)
      return await this.createRelease()
    }
  },

  async createRelease() {
    try {
      const response = await octokit.repos.createRelease({
        owner: GITHUB_ORG,
        repo: GITHUB_REPO,
        tag_name: this.tagName,
        name: VERSION,
        prerelease: true,
        draft: false,
      })

      return response.data.upload_url
    } catch (error) {
      console.warn(error)
      console.log('Retrying...')

      return await this.getRelease()
    }
  },
}

function Release(extension) {
  this.extension = extension

  this.fileName = `DreamTime-${VERSION}-${process.env.BUILD_PLATFORM}.${this.extension}`

  this.filePath = path.resolve(__dirname, '../../dist', this.fileName)

  this.uploadToGithub = async () => {
    if (!process.env.GITHUB_TOKEN) {
      console.warn('No GITHUB_TOKEN!')
      return null
    }

    try {
      console.log(`Uploading ${this.fileName} to Github...`)

      const stats = fs.statSync(this.filePath)
      const url = await GitHub.getRelease()

      const response = await octokit.repos.uploadReleaseAsset({
        url,
        headers: {
          'content-length': stats.size,
          'content-type': mime.lookup(this.filePath),
        },
        name: this.fileName,
        data: fs.createReadStream(this.filePath),
      })

      return response
    } catch (err) {
      console.warn('Github error', err)
      return null
    }
  }

  /**
   * @param {string} url
   * @param {FormData} formData
   * @param {object} customHeaders
   */
  this.uploadTo = async (url, formData, customHeaders = {}) => {
    try {
      if (!formData) {
        formData = new FormData()
      }

      formData.append('file', fs.createReadStream(this.filePath), { filename: this.fileName })

      const headers = formData.getHeaders(customHeaders)

      console.log(`Uploading ${this.fileName} to ${url}`)

      let response = await axios.post(url, formData, {
        headers,
        timeout: (15 * 60 * 1000),
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      })

      response = response.data

      addResponse(response)

      return response
    } catch (err) {
      console.warn(`${url} error`, {
        code: err.code,
        status: get(err, 'response.status'),
        statusText: get(err, 'response.statusText'),
      })

      return null
    }
  }

  this.uploadToDreamLink = async () => {
    const formData = new FormData()
    formData.append('pin', 'false')

    let response = await this.uploadTo('https://ipfs.valeria.dreamnet.tech/api/v0/add', formData, {
      Authorization: `Basic ${process.env.DREAMLINK_TOKEN}`,
    })

    if (response) {
      response = ndjson(response)
      addCommand(response[response.length - 1].Hash, this.fileName)
    }
  }

  this.uploadToInfura = async () => {
    const formData = new FormData()
    formData.append('pin', 'true')

    let response = await this.uploadTo('https://ipfs.infura.io:5001/api/v0/add', formData)

    if (response) {
      response = ndjson(response)
      addUrl(`https://ipfs.infura.io/ipfs/${response[response.length - 1].Hash}`, this.fileName)
    }
  }

  this.uploadToPinata = async () => {
    const response = await this.uploadTo('https://api.pinata.cloud/pinning/pinFileToIPFS', null, {
      pinata_api_key: process.env.PINATA_KEY,
      pinata_secret_api_key: process.env.PINATA_SECRET,
    })

    if (response) {
      addUrl(`https://gateway.pinata.cloud/ipfs/${response.IpfsHash}`, this.fileName)
    }
  }

  this.upload = async () => {
    if (!fs.existsSync(this.filePath)) {
      console.log('No release found!', {
        filePath: this.filePath,
        fileName: this.fileName,
      })

      return
    }

    if (GitHub.isTagRelease) {
      await this.uploadToGithub()
    }

    await this.uploadToDreamLink()
    await this.uploadToPinata()
    await this.uploadToInfura()
  }
}

process.on('unhandledRejection', (err) => {
  throw err
})

const installer = new Release(process.env.BUILD_EXTENSION)
const portable = new Release('zip')

async function main() {
  await installer.upload()
  await portable.upload()

  console.log(cryptr.encrypt(JSON.stringify(output)))
}

main()
