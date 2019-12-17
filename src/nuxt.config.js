/* eslint-disable no-param-reassign */

const dev = process.env.NODE_ENV === 'development'

module.exports = {
  /**
   *
   */
  mode: 'spa',

  /**
   *
   */
  router: {
    mode: 'hash',
  },

  /**
   * Server settings
   */
  server: {
    port: process.env.SERVER_PORT,
    host: process.env.SERVER_HOST,
  },

  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_displayName,

    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      // { 'http-equiv': 'Content-Security-Policy', content: 'default-src \'self\'; script-src \'self\' \'unsafe-inline\' https://cdn.logrocket.io https://cdn.lr-ingest.io; worker-src \'self\' \'unsafe-inline\' data: blob:; object-src \'none\'; style-src \'self\' \'unsafe-inline\' https://fonts.googleapis.com; img-src \'self\' data:; media-src \'self\' data:; frame-src \'self\' https://*.dreamnet.tech; font-src *; connect-src \'self\' http://localhost:* https://*.dreamnet.tech wss://app.nucleus.sh https://nucleus.sh https://*.logrocket.io https://r.lr-ingest.io https://*.github.com' },
    ],
  },

  /**
   *
   */
  render: {
    csp: {
      hashAlgorithm: 'sha256',
      policies: {
        'default-src': [
          'self',
        ],
        'script-src': [
          'self',
          'unsafe-inline',
          'https://cdn.logrocket.io',
          'https://cdn.lr-ingest.io',
        ],
        'worker-src': [
          'self',
          'unsafe-inline',
          'data:',
          'blob:',
        ],
        'object-src': [
          'none',
        ],
        'style-src': [
          'self',
          'unsafe-inline',
          'https://fonts.googleapis.com',
        ],
        'img-src': [
          'self',
          'data:',
        ],
        'media-src': [
          'self',
          'data:',
        ],
        'frame-src': [
          'self',
          'https://*.dreamnet.tech',
        ],
        'font-src': [
          '*',
        ],
        'connect-src': [
          'self',
          'http://localhost:*',
          'https://*.dreamnet.tech',
          'wss://app.nucleus.sh',
          'https://nucleus.sh',
          'https://*.logrocket.io',
          'https://r.lr-ingest.io',
          'https://*.github.com',
        ],
      },
      addMeta: true,
    },
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
    'tui-image-editor/dist/tui-image-editor.css',
    'tui-color-picker/dist/tui-color-picker.css',

    '~/assets/css/tailwind.scss',
    '~/assets/css/reset.scss',
    '~/assets/css/components/_all.scss',
    '~/assets/css/utilities/_all.scss',
    '~/assets/css/fonts.scss',
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/boot.js',
    '~/plugins/setup.js',
    '~/plugins/fontawesome.js',
    '~/components',
  ],

  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/Developmint/nuxt-purgecss
    'nuxt-purgecss',
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss',
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [],

  /**
   *
   */
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.scss',
  },

  /**
   *
   */
  purgeCSS: {
    enabled: !dev,
    whitelistPatterns: [/tippy/, /cropper/, /tui/, /color-picker/, /swal2/, /text-/, /nuxt/, /pre/, /svg/],
  },

  /**
   *
   */
  eslint: {
    cache: dev,
  },

  /**
   *
   */
  dev,

  /*
   ** Build configuration
   */
  build: {
    parallel: true,

    hardSource: false,

    cache: false,

    extractCSS: true,

    /**
     *
     */
    babel: {
      sourceType: 'unambiguous',

      plugins: [
        'lodash',
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

    /**
     *
     */
    loaders: {
      imgUrl: {
        limit: 10 * 1000,
      },
    },

    /**
     *
     */
    terser: {
      parallel: true,
    },

    /**
     *
     */
    optimization: {
      splitChunks: {
        // minSize: 30000,
        // maxSize: 3000000,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            reuseExistingChunk: true,
          },
        },
      },
    },

    /*
     ** You can extend webpack config here
     */
    extend(config, { isDev }) {
      const webpack = require('webpack')

      config.target = 'electron-renderer'

      config.module.rules.push({
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' },
        exclude: /(node_modules)/,
      })

      // eslint-disable-next-line no-useless-escape
      config.plugins.push(new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/))

      if (isDev) {
        config.devtool = 'inline-source-map'
      } else {
        config.output.publicPath = './_nuxt/'
      }
    },
  },
}
