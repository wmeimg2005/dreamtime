// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

const { app, BrowserWindow } = require('electron')
const http = require('http')
const path = require('path')
const fs = require('fs')
const contextMenu = require('electron-context-menu')
const utils = require('electron-utils')
const logger = require('logplease').create('electron')

const { AppError } = require('./scripts')
const { settings, nucleus, rollbar } = require('./scripts/services')
const { system } = require('./scripts/tools')
const config = require('../nuxt.config')

// NuxtJS root directory
config.rootDir = path.dirname(__dirname)

// copyright
console.log(`
  DreamTime.
  Copyright (C) DreamNet. All rights reserved.

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License 3.0 as published by
  the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
`)

logger.info('Starting...')

logger.debug({
  env: process.env.NODE_ENV,
  paths: {
    appPath: app.getAppPath(),
    exePath: app.getPath('exe'),
  },
  isStatic: utils.pack.isStatic(),
})

class DreamApp {
  /**
   * Start the app!
   */
  static async start() {
    await this.setup()

    this.createWindow()
  }

  /**
   * Prepare the application.
   */
  static async setup() {
    // https://electronjs.org/docs/tutorial/notifications#windows
    app.setAppUserModelId(process.execPath)

    // https://github.com/sindresorhus/electron-util#enforcemacosapplocation-macos
    utils.enforceMacOSAppLocation()

    // system stats.
    await system.setup()

    // user settings.
    await settings.setup()

    // analytics.
    await nucleus.setup()

    // bug tracking.
    rollbar.setup()

    //
    this.createModelsDir()

    //
    contextMenu({
      showSaveImageAs: true,
    })
  }

  /**
   * Create the program window and load the interface
   */
  static createWindow() {
    // Create the browser window.
    this.window = new BrowserWindow({
      width: 1200,
      height: 700,
      minWidth: 1200,
      minHeight: 700,
      icon: path.join(config.rootDir, 'dist', 'icon.ico'),
      webPreferences: {
        // Script that offers secure communication to the NodeJS API
        preload: path.join(app.getAppPath(), 'electron', 'preload.js'),
      },
    })

    // Disable the default menu
    this.window.setMenu(null)

    // Get the interface location
    this.loadURL = this.getNuxtAppLocation()

    if (config.dev) {
      // Development
      this.pollServer()
    } else {
      // Production, load the static interface!
      this.window.loadFile(this.loadURL)
    }

    if (process.env.DEVTOOLS) {
      // Load the DevTools
      this.window.webContents.openDevTools()
    }
  }

  /**
   * Wait until the NuxtJS server is ready.
   */
  static pollServer() {
    console.log(`Requesting status from the server: ${this.loadURL}`)

    http
      .get(this.loadURL, (response) => {
        if (response.statusCode === 200) {
          console.log('> Server ready, show time!')
          this.window.loadURL(this.loadURL)
        } else {
          console.log(
            `> The server reported the status code: ${response.statusCode}`,
          )
          setTimeout(this.pollServer.bind(this), 300)
        }
      })
      .on('error', () => {
        setTimeout(this.pollServer.bind(this), 300)
      })
  }

  /**
   * Returns the location of the interface
   */
  static getNuxtAppLocation() {
    if (!config.dev) {
      return path.join(config.rootDir, 'dist', 'index.html')
    }

    return `http://localhost:${config.server.port}`
  }

  /**
   * Create the model folder to save the processed photos
   */
  static createModelsDir() {
    const modelsPath = path.join(settings.folders.models, 'Uncategorized')

    if (!fs.existsSync(modelsPath)) {
      fs.mkdirSync(
        modelsPath,
        {
          recursive: true,
        },
        (error) => {
          throw new AppError(
            `Trying to create the directory to save the models,
          please make sure that the application has permissions to create the directory:\n
          ${modelsPath}`,
            error,
          )
        },
      )
    }
  }
}

app.on('ready', () => {
  try {
    DreamApp.start()
  } catch (error) {
    rollbar.error(error)
    console.error(error)

    app.quit()
  }
})

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  DreamApp.createWindow()
})
