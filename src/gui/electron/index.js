const { app, BrowserWindow } = require('electron')
const http = require('http')
const path = require('path')
const fs = require('fs')
const debug = require('debug').default('app:electron:main')
const config = require('../nuxt.config')

//
config.rootDir = path.dirname(__dirname)

//
debug('Starting in: ', config.dev ? process.env.NODE_ENV : 'production')

class DreamApp {
  /**
   *
   */
  static start() {
    this.setup()
    this.createWindow()
  }

  /**
   *
   */
  static setup() {
    this.createModelsDir()
    this.createSettings()
  }

  /**
   *
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
        // (interact with the filesystem, start processes, etc).
        preload: path.join(
          app.getAppPath(),
          'electron',
          'deepTools',
          'index.js'
        )
      }
    })

    this.window.setMenu(null)

    // Start the server and get the address
    this.loadURL = this.getNuxtAppLocation()

    if (config.dev) {
      //
      this.window.webContents.openDevTools()
      this.pollServer()
    } else {
      this.window.loadFile(this.loadURL)
    }
  }

  /**
   *
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
   *
   */
  static getNuxtAppLocation() {
    if (!config.dev) {
      return path.join(config.rootDir, 'dist', 'index.html')
    }

    return `http://localhost:${config.server.port}`
  }

  /**
   *
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

  /**
   *
   */
  static createSettings() {
    const configPath = path.join(config.rootDir, 'settings.json')

    const defaultSettings = {
      process: {
        useCpu: false,
        useGpus: [],
        useWaifu: false
      },

      preferences: {
        enablePubes: true,
        boobsSize: 'medium',
        pubicHairSize: 'medium',
        useCustomMask: false,
        useRestoration: true
      }
    }

    if (!fs.existsSync(configPath)) {
      fs.writeFileSync(configPath, JSON.stringify(defaultSettings, null, 2))
    }
  }
}

app.on('ready', () => {
  try {
    DreamApp.start()
  } catch (error) {
    console.error(error)
    app.quit()
  }
})

app.on('window-all-closed', () => app.quit())

// app.on('activate', () => win === null && newWin())
