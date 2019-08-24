/*
 * DreamTime | (C) 2019 by Ivan Bravo Bravo <ivan@dreamnet.tech>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License 3.0 as published by
 * the Free Software Foundation.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

const Octokit = require('@octokit/rest')
const AWS = require('aws-sdk')
const mime = require('mime-types')
const _ = require('lodash')
const Deferred = require('deferred')
const fs = require('fs')
const path = require('path')
const pkg = require('../package.json')

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
})

const S3Client = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  endpoint: 'https://sfo2.digitaloceanspaces.com'
})

function getOS() {
  if (process.platform === 'win32') {
    return 'windows'
  }
  if (process.platform === 'darwin') {
    return 'macos'
  }

  return 'ubuntu'
}

function getExt() {
  if (process.platform === 'win32') {
    return 'exe'
  }
  if (process.platform === 'darwin') {
    return 'dmg'
  }

  return 'deb'
}

const isTagRelease = _.startsWith(process.env.GITHUB_REF, 'refs/tags')

const tagName = isTagRelease
  ? process.env.GITHUB_REF.split('/')[2]
  : _.truncate(process.env.GITHUB_SHA, { length: 7, omission: '' })

const version = `v${pkg.version}`

const fileName = `DreamTime-${version}-${getOS()}-${
  process.env.BUILD_DEVICE
}.${getExt()}`

const filePath = path.resolve(__dirname, '../../dist', fileName)

async function getGithubReleaseUrl() {
  let response

  try {
    response = await octokit.repos.getReleaseByTag({
      owner: 'private-dreamnet',
      repo: 'dreamtime',
      tag: tagName
    })
  } catch (err) {
    if (err.status !== 404) {
      throw err
    }

    console.log(`Creating release for tag: ${tagName}...`)

    try {
      response = await octokit.repos.createRelease({
        owner: 'private-dreamnet',
        repo: 'dreamtime',
        tag_name: tagName,
        name: version,
        prerelease: true,
        draft: false
      })
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  return response.data.upload_url
}

function uploadToS3(filePath, fileName) {
  const deferred = new Deferred()

  S3Client.upload(
    {
      Bucket: 'dreamnet-cdn',
      Key: `releases/dreamtime/${tagName}/${fileName}`,
      Body: fs.createReadStream(filePath)
    },
    (err, response) => {
      if (err) {
        deferred.reject(err)
        return
      }

      deferred.resolve(response)
    }
  )

  return deferred.promise
}

async function uploadToGithub(filePath, fileName) {
  const stats = fs.statSync(filePath)
  const url = await getGithubReleaseUrl()

  const response = await octokit.repos.uploadReleaseAsset({
    url,
    headers: {
      'content-length': stats.size,
      'content-type': mime.lookup(filePath)
    },
    name: fileName,
    file: fs.createReadStream(filePath)
  })

  return response
}

async function upload(filePath, fileName) {
  let response

  if (isTagRelease) {
    console.log(`Uploading ${fileName} to Github...`)
    response = await uploadToGithub(filePath, fileName)
    console.log('Github say: ', response)
  }

  console.log(`Uploading ${fileName} to S3...`)
  response = await uploadToS3(filePath, fileName)
  console.log('S3 say:', response)
}

async function main() {
  if (fs.existsSync(filePath)) {
    upload(filePath, fileName)

    if (pkg.version === '1.2.0' && process.env.BUILD_DEVICE === 'any') {
      const legacyAnyFileName = `DreamTime-${version}-${getOS()}-x64.${getExt()}`
      const legacy2AnyFileName = `DreamTime-v${version}-${getOS()}-x64.${getExt()}`

      upload(filePath, legacyAnyFileName)
      upload(filePath, legacy2AnyFileName)
    }
  } else {
    console.log('No release found!')
  }
}

process.on('unhandledRejection', (err) => {
  throw err
})

main()
