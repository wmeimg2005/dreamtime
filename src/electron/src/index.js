// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import { startsWith } from 'lodash'
import { app, BrowserWindow, shell } from 'electron'
import http from 'http'
import { dirname, join } from 'path'
import { URL } from 'url'
import contextMenu from 'electron-context-menu'
import Logger from 'logplease'
import { enforceMacOSAppLocation, is } from 'electron-util'
import { AppError } from './modules/app-error'
import { settings, nucleus, rollbar } from './modules/services'
import { system } from './modules/tools/system'
import { existsSync, mkdirSync } from './modules/tools/fs'
import { getPath } from './modules/tools/paths'
import { dreamtime, dreampower, checkpoints } from './modules/updater'
import config from '~/nuxt.config'

const logger = Logger.create('electron')

// NuxtJS root directory
config.rootDir = dirname(dirname(__dirname))

if (!is.development) {
  process.chdir(getPath('exe', '../'))
}

class DreamApp {
  /**
   * Start the app!
   */
  static async start() {
    // logger setup
    Logger.setLogLevel(process.env.LOG || 'info')
    Logger.setLogfile(getPath('userData', 'dreamtime.log'))

    logger.info('Starting...')

    logger.debug({
      env: process.env.NODE_ENV,
      paths: {
        appPath: app.getAppPath(),
        exePath: app.getPath('exe'),
      },
    })

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
    enforceMacOSAppLocation()

    // macos activate.
    app.on('activate', () => {
      this.createWindow()
    })

    // application exit.
    app.on('will-quit', async (event) => {
      event.preventDefault()

      await this.shutdown()

      app.exit()
    })

    // system stats.
    await system.setup()

    // user settings.
    await settings.setup()

    // analytics & app settings.
    await nucleus.setup()

    // services
    await Promise.all([
      rollbar.setup(), // bug tracking.
      system.scan(), // requirements.
    ])

    // update providers
    await Promise.all([
      dreamtime.setup(),
      dreampower.setup(),
      checkpoints.setup(),
    ])

    //
    this.createDirs()

    //
    contextMenu({
      showSaveImageAs: true,
    })
  }

  /**
   *
   */
  static async shutdown() {
    await rollbar.shutdown()
  }

  /**
   * Create the program window and load the interface
   */
  static createWindow() {
    // browser window.
    this.window = new BrowserWindow({
      width: 1200,
      height: 700,
      minWidth: 1200,
      minHeight: 700,
      frame: false,
      icon: join(config.rootDir, 'dist', 'icon.ico'),
      webPreferences: {
        nodeIntegration: true,
        preload: join(app.getAppPath(), 'electron', 'dist', 'provider.js'),
      },
    })

    // disable menu
    this.window.setMenu(null)

    // ui location
    this.uiUrl = this.getUiUrl()

    if (config.dev) {
      this.pollUi()
    } else {
      this.window.loadFile(this.uiUrl)
    }

    if (process.env.DEVTOOLS) {
      // devtools
      this.window.webContents.openDevTools()
    }
  }

  /**
   * Wait until the NuxtJS server is ready.
   */
  static pollUi() {
    logger.debug(`Requesting status from the server: ${this.uiUrl}`)

    http
      .get(this.uiUrl, (response) => {
        if (response.statusCode === 200) {
          logger.debug('Server ready, dream time!')
          this.window.loadURL(this.uiUrl)
        } else {
          logger.warn(`The server reported: ${response.statusCode}`)
          setTimeout(this.pollUi.bind(this), 300)
        }
      })
      .on('error', (error) => {
        logger.warn('Poll error', error)
        setTimeout(this.pollUi.bind(this), 300)
      })
  }

  /**
   * Returns the url of the user interface
   *
   * @return {string}
   */
  static getUiUrl() {
    if (!config.dev) {
      return join(config.rootDir, 'dist', 'index.html')
    }

    return `http://localhost:${config.server.port}`
  }

  /**
   * Create required directories.
   */
  static createDirs() {
    const modelsPath = join(settings.folders.models, 'Uncategorized')

    if (!existsSync(modelsPath)) {
      mkdirSync(modelsPath, { recursive: true },
        (error) => {
          throw new AppError(`Models directory creation fail.`, { error })
        })
    }
  }
}

process.on('uncaughtException', (err) => {
  logger.warn('Unhandled exception!', err)
  AppError.handle(err)

  return true
})

process.on('unhandledRejection', (err) => {
  logger.warn('Unhandled rejection!', err)
  AppError.handle(err)

  return true
})

app.on('web-contents-created', (e, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const url = new URL(navigationUrl)

    if (url.host === `${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`) {
      // ok
      return
    }

    event.preventDefault()

    logger.warn('Blocked attempt to load an external page.', {
      event,
      url,
    })
  })

  contents.on('new-window', (event, url) => {
    if (startsWith(url, 'http')) {
      event.preventDefault()
      shell.openExternal(url)
      return
    }

    logger.debug('Opening new window.', {
      event,
      url,
    })
  })
})

app.on('window-all-closed', () => {
  app.quit()
})

app.on('ready', async () => {
  try {
    await DreamApp.start()
  } catch (error) {
    throw new AppError(error, { title: `Failed to start correctly.`, fatal: true })
  }
})
