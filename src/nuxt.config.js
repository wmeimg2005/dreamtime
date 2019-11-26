/* eslint-disable no-param-reassign */
/* eslint-disable nuxt/no-cjs-in-config */

const nodeExternals = require('webpack-node-externals')

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
    title: `${process.env.npm_package_displayName} v${process.env.npm_package_version}`,

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
  plugins: ['~/plugins/boot.js', '~/plugins/fontawesome.js', '~/components'],

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

  tailwindcss: {
    cssPath: '~/assets/css/tailwind.scss',
  },

  /**
   *
   */
  dev: process.env.NODE_ENV === 'development',

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
        [
          'transform-inline-environment-variables',
          {
            exclude: [
              'LOG',
              'DEVTOOLS',
            ],
          },
        ],
      ],
    },

    /*
     ** You can extend webpack config here
     */
    extend(config, { isClient, isDev }) {
      config.target = 'electron-renderer'

      config.externals = [nodeExternals({
        modulesFromFile: {
          include: ['dependencies'],
        },
      })]

      // exclude browser field resolution
      const mainFields = ['esnext', 'main']
      config.resolve.mainFields = mainFields
      config.resolve.aliasFields = mainFields

      config.node = {
        __dirname: process.env.NODE_ENV === 'development',
        __filename: process.env.NODE_ENV === 'development',
      }

      if (isDev) {
        config.devtool = isClient ? 'source-map' : 'inline-source-map'
      } else {
        config.output.publicPath = './_nuxt/'
      }
    },
  },
}
