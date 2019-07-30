const utils = require('electron-utils')
const { AppError, settings, nucleus, rollbar } = require('./modules')
const tools = require('./tools')

// Electron Utils
window.$utils = utils

// Custom Error
window.AppError = AppError

// User Settings
window.$settings = settings

// Nucleus (Analytics & App Settings)
window.$nucleus = nucleus

// Rollbar (Error reporting)
window.$rollbar = rollbar

// Tools
window.$tools = tools

// Tools (Legacy)
window.deepTools = window.$tools
