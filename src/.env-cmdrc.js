const development = {
  "LOG": "debug",
  "DEVTOOLS": true,
}

module.exports = {
  "default": {
    "SERVER_HOST": "localhost",
    "SERVER_PORT": 4000
  },
  "development": {
    "NODE_ENV": "development",
    "ROLLBAR_ACCESS_TOKEN": "e62c909ec771492fa7f371dc61eea092",
    "LOGROCKET_ACCESS_TOKEN": "of2lox/dreamtime",
    "DREAMTRACK_HOST": "track.dreamnet.tech",
    ...development
  },
  "production": {
    "NODE_ENV": "production",
    "LOG": "info",
    "DREAMTRACK_HOST": "track.dreamnet.tech"
  },
  "test": {
    "NODE_ENV": "test",
    "LOG": "debug"
  },
  "preview": {
    ...development
  }
}
