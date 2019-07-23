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
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ],

    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],

    scripts: [
      {
        src: 'https://www.gstatic.com/firebasejs/6.3.1/firebase-app.js'
      }
    ]
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

    SENTRY_DSN: process.env.SENTRY_DSN,

    FIREBASE_KEY: process.env.FIREBASE_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_SENDER_ID: process.env.FIREBASE_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,

    BULLET_TRAIN_KEY: process.env.BULLET_TRAIN_KEY,

    GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID
  },

  /*
   ** Build configuration
   */
  build: {
    /**
     *
     */
    postcss: {
      plugins: {
        tailwindcss: './tailwind.config.js'
      }
    },

    /**
     *
     */
    terser: {
      sourceMap: true
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
