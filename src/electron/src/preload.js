import { AppError } from './scripts'
import { settings, nucleus, rollbar } from './scripts/services'
import * as tools from './scripts/tools'

// Custom Error
window.AppError = AppError

// User settings
window.$settings = settings

// Analytics & App settings
// https://nucleus.sh/docs/gettingstarted
window.$nucleus = nucleus

// Error reporting
// https://docs.rollbar.com/docs/nodejs
window.$rollbar = rollbar

// Tools
window.$tools = tools

// Tools (Legacy)
window.deepTools = window.$tools
