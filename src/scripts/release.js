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

const Octokit = require('@octokit/rest')
const mime = require('mime-types')
const { startsWith, truncate } = require('lodash')
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const FormData = require('form-data')
const Cryptr = require('cryptr')
const pkg = require('../package.json')

// Settings
const GITHUB_ORG = 'dreamnettech'
const GITHUB_REPO = 'dreamtime'
const VERSION = `v${pkg.version}`

// Encryption key
const cryptr = new Cryptr(process.env.SECRET_KEY)

// Octokit
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

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

  this.stream = fs.createReadStream(this.filePath)

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
        file: this.stream,
      })

      return response
    } catch (err) {
      console.warn('Github error', err)
      return null
    }
  }

  this.uploadTo = async (url, formData, headers = {}) => {
    try {
      if (!formData) {
        formData = new FormData()
      }

      formData.append('file', this.stream, { filename: this.fileName })

      console.log(`Uploading to ${url}`)

      let response = await axios.post(url, formData, {
        headers: {
          ...formData.getHeaders(),
          ...headers,
        },
        timeout: (5 * 60 * 1000),
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      })

      response = response.data

      const responseUrl = cryptr.encrypt(JSON.stringify(response))

      console.log(`${url}: ${responseUrl}`)

      return response
    } catch (err) {
      console.warn(`${url} error`, err.response)
      return null
    }
  }

  this.uploadToAnonFile = () => this.uploadTo('https://api.anonfile.com/upload')

  this.uploadToAnon = () => {
    const formData = new FormData()
    formData.append('expires', '6m')

    return this.uploadTo('https://api.anonymousfiles.io', formData)
  }

  this.uploadToFileIo = () => {
    const formData = new FormData()
    formData.append('expires', '1y')

    return this.uploadTo('https://file.io', formData)
  }

  this.uploadToInfura = () => {
    const formData = new FormData()
    formData.append('pin', 'true')

    return this.uploadTo('https://ipfs.infura.io:5001/api/v0/add', formData)
  }

  this.uploadToDreamLink = () => this.uploadTo('http://api.link.dreamnet.tech/add', null, {
    Authorization: `Basic ${process.env.DREAMLINK_TOKEN}`,
  })

  this.upload = async () => {
    if (!fs.existsSync(this.filePath)) {
      console.log('No release found!', {
        filePath: this.filePath,
        fileName: this.fileName,
      })

      return
    }

    let workload = []

    if (GitHub.isTagRelease) {
      workload.push(this.uploadToGithub())
      workload.push(this.uploadToDreamLink())

      await Promise.all(workload)
      workload = []
    }

    if (process.env.TEST) {
      workload.push(this.uploadToDreamLink())
    } else {
      workload.push([
        this.uploadToAnon(),
        this.uploadToFileIo(),
        this.uploadToInfura(),
      ])
    }

    await Promise.all(workload)
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
}

main()
