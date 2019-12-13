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
    ],
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
    '~/assets/css/fonts.scss',
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/boot.js', '~/plugins/setup.js', '~/plugins/fontawesome.js', '~/components'],

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
    whitelistPatterns: [/tippy/, /cropper/, /tui/, /color-picker/],
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

    hardSource: dev,

    cache: dev,

    extractCSS: !dev,

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
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },

    /*
     ** You can extend webpack config here
     */
    extend(config, { isDev }) {
      config.target = 'electron-renderer'

      config.module.rules.push({
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' },
        exclude: /(node_modules)/,
      })

      if (isDev) {
        config.devtool = 'source-map'
      } else {
        config.output.publicPath = './_nuxt/'

        const webpack = require('webpack')

        // eslint-disable-next-line no-useless-escape
        config.plugins.push(new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/))
      }
    },
  },
}
