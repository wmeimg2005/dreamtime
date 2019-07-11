require('dotenv').config()
const { app, BrowserWindow } = require('electron')
const { Nuxt } = require('nuxt')
const http = require('http')
const path = require('path')
const config = require('./nuxt.config')

config.rootDir = __dirname

function startNuxtApp() {
  const nuxt = new Nuxt(config)

  console.log(config.dev)

  if (!config.dev) {
    const server = http.createServer(nuxt.render)
    server.listen()

    return `http://localhost:${server.address().port}`
  }

  return `http://localhost:3000`
}

function createWindow() {
  const url = startNuxtApp()

  // Create the browser window.
  const window = new BrowserWindow({
    width: 1000,
    height: 800,
    minWidth: 1000,
    minHeight: 800,
    webPreferences: {
      preload: path.join(app.getAppPath(), 'preload.js')
    }
  })

  if (config.dev) {
    const {
      default: installExtension,
      VUEJS_DEVTOOLS
    } = require('electron-devtools-installer')

    installExtension(VUEJS_DEVTOOLS.id)
      .then(name => {
        console.log(`Added Extension:  ${name}`)
        window.webContents.openDevTools()
      })
      .catch(err => console.log('An error occurred: ', err))

    window.loadURL(url)
  } else {
    const pollServer = () => {
      console.log('pollServer')

      http
        .get(url, res => {
          if (res.statusCode === 200) {
            console.log('ready')
            window.loadURL(url)
          } else {
            setTimeout(pollServer, 300)
          }
        })
        .on('error', pollServer)
    }

    pollServer()
  }
}

app.on('ready', createWindow)
app.on('window-all-closed', () => app.quit())
// app.on('activate', () => win === null && newWin())
