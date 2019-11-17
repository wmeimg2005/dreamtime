require('dotenv').config()

// eslint-disable-next-line nuxt/no-cjs-in-config
module.exports = {
  mode: 'spa',

  /**
   *
   */
  router: {
    mode: 'hash',
  },

  /**
   * Dev-Server settings
   */
  server: {
    port: process.env.SERVER_PORT,
    host: process.env.SERVER_HOST,
  },

  /*
   ** Headers of the page
   */
  head: {
    title: `${process.env.APP_NAME} v${process.env.APP_VERSION}`,

    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],

    link: [],

    scripts: [],
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },

  /*
   ** Global CSS
   */
  css: [
    'tippy.js/dist/tippy.css',
    'cropperjs/dist/cropper.css',

    '~/assets/css/tailwind.scss',
    '~/assets/css/fonts.scss',
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/boot.client.js', '~/components'],

  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss',
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // '@nuxtjs/pwa',
    '@nuxtjs/dotenv',
  ],

  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},

  /**
   *
   */
  dev: process.env.NODE_ENV === 'development',

  /**
   *
   */
  env: {
    APP_NAME: process.env.APP_NAME,
    APP_VERSION: process.env.APP_VERSION,
    NUCLEUS_APPID: process.env.NUCLEUS_APPID,
  },

  /*
   ** Build configuration
   */
  build: {
    analyze: false,

    extractCSS: true,

    babel: {
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-proposal-optional-chaining',
      ],
    },

    /*
     ** You can extend webpack config here
     */
    extend(config, { isClient, isDev }) {
      if (isDev) {
        config.devtool = isClient ? 'source-map' : 'inline-source-map'

        // const RollbarSourceMapPlugin = require('rollbar-sourcemap-webpack-plugin')
        /*
        config.plugins.push(
          new RollbarSourceMapPlugin({
            accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
            version: process.env.npm_package_version,
            publicPath: source => {
              console.log(source)
              return `@/${source}`
            }
          })
        )
        */
      } else {
        config.output.publicPath = './_nuxt/'
      }
    },
  },
}
