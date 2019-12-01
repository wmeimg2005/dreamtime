module.exports = {
  "default": {
    "SERVER_HOST": "localhost",
    "SERVER_PORT": 3000,
    "NUCLEUS_APPID": "5d353cecbe5ccc0133cf90f4"
  },
  "development": {
    "name": "development",
    "NODE_ENV": "development",
    "LOG": "debug",
    "DEVTOOLS": true,
    "ROLLBAR_ACCESS_TOKEN": "6ccfcf317ca54e67830b41570ce23d2a"
  },
  "production": {
    "name": "production",
    "NODE_ENV": "production",
    "LOG": "info"
  },
  "test": {
    "name": "test",
    "NODE_ENV": "test",
    "LOG": "debug"
  },
  "preview": {
    "DEVTOOLS": true,
    "ROLLBAR_ACCESS_TOKEN": "6ccfcf317ca54e67830b41570ce23d2a"
  }
}
