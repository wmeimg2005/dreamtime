const { settings, bullet } = require('./modules')
const { sentry, nucleus } = require('./telemetry')

// User Settings
window.$settings = settings

// Application Settings
window.$bullet = bullet

// Sentry (Error reporting)
window.$sentry = sentry

// Nucleus (Analytics)
window.$nucleus = nucleus

// Tools
window.$tools = require('./tools')

window.deepTools = window.$tools
