const { app, BrowserWindow } = require('electron')
const { Nuxt } = require('nuxt')
const http = require('http')
const path = require('path')
const fs = require('fs')
const config = require('../nuxt.config')
const debug = require('debug').default('app:electron:main')

//
config.rootDir = path.dirname(__dirname)

//
debug('Starting in: ', config.dev ? process.env.NODE_ENV : 'production')

/**
 * Start the NuxtJS server with the interface
 * TODO: Find a way to use the interface without opening a server!
 */
function startNuxtApp() {
  const nuxt = new Nuxt(config)

  if (!config.dev) {
    // If we are in production it is required to start the server.
    const server = http.createServer(nuxt.render)
    server.listen()

    const serverURL = `http://localhost:${server.address().port}`
    debug(`Server started in ${serverURL}`)

    return serverURL
  }

  // In development we assume that the developer has started the server
  // using the command `yarn dev`
  return `http://localhost:3000`
}

/**
 * TODO: Move to the Models module
 */
function createModelsDir() {
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
 * Create the Electron browser window that will serve as access to the interface.
 */
function createWindow() {
  // Start the server and get the address
  const serverURL = startNuxtApp()

  // Create the browser window.
  const window = new BrowserWindow({
    width: 1000,
    height: 800,
    minWidth: 1000,
    minHeight: 800,
    webPreferences: {
      // This script offers us the necessary tools to communicate with the operating system.
      // (interact with the filesystem, start processes, etc).
      preload: path.join(app.getAppPath(), 'electron', 'deepTools', 'index.js')
    }
  })

  if (config.dev) {
    window.webContents.openDevTools()
  }

  //
  const pollServer = () => {
    debug('Requesting status from the server...')

    http
      .get(
        serverURL,
        {
          agent: false
        },
        response => {
          if (response.statusCode === 200) {
            debug('> Server ready, show time!')
            window.loadURL(serverURL)
          } else {
            debug(
              `> The server reported the status code: ${response.statusCode}`
            )
            setTimeout(pollServer, 300)
          }
        }
      )
      .on('error', error => {
        debug(`> ${error}`)
        setTimeout(pollServer, 300)
      })
  }

  pollServer()
}

//
createModelsDir()

app.on('ready', createWindow)
app.on('window-all-closed', () => app.quit())
// app.on('activate', () => win === null && newWin())
