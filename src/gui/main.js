const { app, BrowserWindow } = require('electron')
const { Nuxt } = require('nuxt')
const http = require('http')
const path = require('path')
const config = require('./nuxt.config')

config.rootDir = __dirname

console.log('Starting in: ', config.dev ? process.env.NODE_ENV : 'Production')

function startNuxtApp() {
  const nuxt = new Nuxt(config)

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
      preload: path.join(app.getAppPath(), 'deepTools.js')
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
