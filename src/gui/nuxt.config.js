const SentryWebpackPlugin = require('@sentry/webpack-plugin')
require('dotenv').config()

module.exports = {
  mode: 'spa',

  /**
   *
   */
  router: {
    mode: 'hash'
  },

  /**
   * Dev-Server settings
   */
  server: {
    port: process.env.SERVER_PORT,
    host: process.env.SERVER_HOST
  },

  /*
   ** Headers of the page
   */
  head: {
    title: `${process.env.APP_NAME} v${process.env.npm_package_version}`,

    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { 'http-equiv': 'Content-Security-Policy', content: "'unsafe-inline'" }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },

  /*
   ** Global CSS
   */
  css: [
    '~/assets/css/tailwind.scss',
    '~/assets/css/fonts.scss',
    '~/assets/css/vendor.scss'
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/boot.client.js', '~/components'],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // '@nuxtjs/eslint-module',
    '@nuxtjs/dotenv'
  ],

  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},

  /**
   *
   */
  dev: process.env.NODE_ENV === 'dev',

  /**
   *
   */
  env: {
    APP_NAME: process.env.APP_NAME,
    APP_VERSION: process.env.npm_package_version,
    SENTRY_DSN: process.env.SENTRY_DSN
  },

  /*
   ** Build configuration
   */
  build: {
    postcss: {
      plugins: {
        tailwindcss: './tailwind.config.js'
      }
    },

    /*
     ** You can extend webpack config here
     */
    extend(config, { isDev }) {
      if (!isDev) {
        config.plugins.push(
          new SentryWebpackPlugin({
            include: '.',
            ignoreFile: '.sentrycliignore',
            ignore: ['node_modules', 'nuxt.config.js'],
            configFile: 'sentry.properties'
          })
        )
      }

      if (!isDev) {
        // relative links, please.
        config.output.publicPath = './_nuxt/'
      }
    }
  }
}
