const { app, BrowserWindow } = require('electron')
const http = require('http')
const path = require('path')
const fs = require('fs')
const debug = require('debug').default('app:electron:main')
const config = require('../nuxt.config')
const { sentry } = require('./telemetry')
// const { settings } = require('./modules')

// We indicate to NuxtJS the root directory of the project
config.rootDir = path.dirname(__dirname)

// debug
debug('Starting in:', config.dev ? process.env.NODE_ENV : 'production')

class DreamApp {
  /**
   * Start the magic!
   */
  static start() {
    this.setup()
    this.createWindow()
  }

  /**
   * Prepare the application for use
   */
  static setup() {
    this.createModelsDir()
  }

  /**
   * Create the program window and load the interface
   */
  static createWindow() {
    // Create the browser window.
    this.window = new BrowserWindow({
      width: 1000,
      height: 800,
      minWidth: 1000,
      minHeight: 800,
      webPreferences: {
        // This script offers us the necessary tools to communicate with the operating system.
        // (filesystem, start processes, etc).
        preload: path.join(app.getAppPath(), 'electron', 'preload.js')
      }
    })

    // Disable the default Electron menu
    this.window.setMenu(null)

    // Get the interface location
    this.loadURL = this.getNuxtAppLocation()

    if (config.dev) {
      // We are in development,
      // we load the DevTools and wait for the NuxtJS server to load.
      this.window.webContents.openDevTools()
      this.pollServer()
    } else {
      // We are in production, only load the interface!
      this.window.loadFile(this.loadURL)
    }
  }

  /**
   * Wait until the NuxtJS server is ready.
   */
  static pollServer() {
    debug(`Requesting status from the server: ${this.loadURL}`)

    const response = http
      .get(this.loadURL, response => {
        if (response.statusCode === 200) {
          debug('> Server ready, show time!')
          this.window.loadURL(this.loadURL)
        } else {
          debug(`> The server reported the status code: ${response.statusCode}`)
          setTimeout(this.pollServer.bind(this), 300)
        }
      })
      .on('error', error => {
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
    const modelsPath = path.join(
      app.getPath('userData'),
      'models',
      'Uncategorized'
    )

    if (!fs.existsSync(modelsPath)) {
      fs.mkdirSync(
        modelsPath,
        {
          recursive: true
        },
        error => {
          throw new Error(
            `An error occurred trying to create the directory to save the models,
          please make sure that the application has permissions to create the directory:\n
          ${modelsPath}`
          )
        }
      )
    }
  }
}

/**
 *
 */
function quit() {
  if (!sentry.can()) {
    app.quit()
    return
  }

  const client = sentry.getCurrentHub().getClient()

  if (client) {
    client.close(2000).then(() => {
      app.exit()
    })
  }
}

app.on('ready', () => {
  try {
    DreamApp.start()
  } catch (error) {
    console.error(error)
    sentry.captureException(error)
    quit()
  }
})

app.on('window-all-closed', () => quit())

// app.on('activate', () => win === null && newWin())
