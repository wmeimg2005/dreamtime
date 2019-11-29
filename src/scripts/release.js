// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

const Octokit = require('@octokit/rest')
const mime = require('mime-types')
const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const FormData = require('form-data')
const Cryptr = require('cryptr')
const pkg = require('../package.json')

const cryptr = new Cryptr(process.env.SECRET_KEY)
const GITHUB_ORG = 'dreamnettech'
const GITHUB_REPO = 'dreamtime'

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

const isTagRelease = _.startsWith(process.env.GITHUB_REF, 'refs/tags')

const tagName = isTagRelease
  ? process.env.GITHUB_REF.split('/')[2]
  : _.truncate(process.env.GITHUB_SHA, { length: 7, omission: '' })

const version = `v${pkg.version}`

const fileName = `dreamtime-${version}-${process.env.BUILD_OS}.${process.env.BUILD_OS_EXTENSION}`

const filePath = path.resolve(__dirname, '../../dist', fileName)

async function getGithubReleaseUrl() {
  let response

  try {
    response = await octokit.repos.getReleaseByTag({
      owner: GITHUB_ORG,
      repo: GITHUB_REPO,
      tag: tagName,
    })
  } catch (err) {
    if (err.status !== 404) {
      throw err
    }

    console.log(`Creating release for tag: ${tagName}...`)

    try {
      response = await octokit.repos.createRelease({
        owner: GITHUB_ORG,
        repo: GITHUB_REPO,
        tag_name: tagName,
        name: version,
        prerelease: true,
        draft: false,
      })
    } catch (err) {
      console.warn(err)
      console.log('Retrying...')

      // eslint-disable-next-line no-return-await
      return await getGithubReleaseUrl()
    }
  }

  return response.data.upload_url
}

async function uploadToGithub(filePath, fileName) {
  if (!process.env.GITHUB_TOKEN) {
    console.warn('No GITHUB_TOKEN')
    return null
  }

  try {
    console.log(`Uploading ${fileName} to Github...`)

    const stats = fs.statSync(filePath)
    const url = await getGithubReleaseUrl()

    const response = await octokit.repos.uploadReleaseAsset({
      url,
      headers: {
        'content-length': stats.size,
        'content-type': mime.lookup(filePath),
      },
      name: fileName,
      file: fs.createReadStream(filePath),
    })

    return response
  } catch (err) {
    console.warn('Github error', err)
    return null
  }
}

async function uploadToAnonFile(filepath, filename) {
  try {
    console.log(`Uploading ${fileName} to anonfile.com...`)

    const formData = new FormData()
    formData.append('file', fs.createReadStream(filepath), { filename })

    let response = await axios.post('https://api.anonfile.com/upload', formData, {
      headers: formData.getHeaders(),
      timeout: (5 * 60 * 1000),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    })

    response = response.data

    console.log('anonfile.com:', cryptr.encrypt(_.get(response, 'data.file.url.full', 'null')))

    return response
  } catch (err) {
    console.warn('anonfile.com error', err)
    return null
  }
}

async function uploadToAnon(filepath, filename) {
  try {
    console.log(`Uploading ${fileName} to anonymousfiles.io...`)

    const formData = new FormData()
    formData.append('file', fs.createReadStream(filepath), { filename })
    formData.append('expires', '6m')

    let response = await axios.post('https://api.anonymousfiles.io', formData, {
      headers: formData.getHeaders(),
      timeout: (5 * 60 * 1000),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    })

    response = response.data

    console.log('anonymousfiles.io:', cryptr.encrypt(_.get(response, 'url', 'null')))

    return response
  } catch (err) {
    console.warn('anonymousfiles.io error', err)
    return null
  }
}

async function uploadToFileIo(filepath, filename) {
  try {
    console.log(`Uploading ${fileName} to file.io...`)

    const formData = new FormData()
    formData.append('file', fs.createReadStream(filepath), { filename })
    formData.append('expires', '1y')

    let response = await axios.post('https://file.io', formData, {
      headers: formData.getHeaders(),
      timeout: (5 * 60 * 1000),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    })

    response = response.data

    console.log('file.io:', cryptr.encrypt(_.get(response, 'link', 'null')))

    return response
  } catch (err) {
    console.warn('file.io error', err)
    return null
  }
}

async function upload(filePath, fileName) {
  const promises = []

  if (isTagRelease) {
    promises.push(uploadToGithub(filePath, fileName))
  }

  promises.push([
    uploadToAnonFile(filePath, fileName),
    uploadToAnon(filePath, fileName),
    uploadToFileIo(filePath, fileName),
  ])

  // TODO: Upload to DreamLink

  return Promise.all(promises)
}

function main() {
  if (fs.existsSync(filePath)) {
    upload(filePath, fileName)
  } else {
    console.log('No release found!')
  }
}

process.on('unhandledRejection', (err) => {
  throw err
})

main()
