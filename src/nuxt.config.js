const dev = process.env.NODE_ENV === 'development'
const analyze = false
const uglify = !dev
const cache = !uglify && dev

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

    link: [
      {
        rel: 'preload', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,400i,500,700|Roboto+Slab:300,400,500,600,700', as: 'style', onload: 'this.rel = \'stylesheet\'',
      },
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
  loading: { color: '#D67411' },

  /*
   ** Global CSS
   */
  css: [
    'tippy.js/dist/tippy.css',
    'cropperjs/dist/cropper.css',
    'vue-slider-component/theme/default.css',

    'sweetalert2/src/sweetalert2.scss',
    '@sweetalert2/theme-dark/dark.css',

    'tui-image-editor/dist/tui-image-editor.css',
    'tui-color-picker/dist/tui-color-picker.css',

    'intro.js/introjs.css',
    'intro.js/themes/introjs-modern.css',

    '~/assets/css/tailwind.scss',
    '~/assets/css/reset/all.scss',
    '~/assets/css/components/all.scss',
    '~/assets/css/utilities/all.scss',
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/binds.js',
    '~/plugins/boot.js',
    '~/plugins/setup.js',
    '~/plugins/fontawesome.js',
    '~/plugins/vue-slider.js',
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
    enabled: uglify,
    mode: 'postcss',

    paths: [
      'components/**/*.vue',
      'layouts/**/*.vue',
      'pages/**/*.vue',
      'plugins/**/*.js',
      'modules/**/*.js',
      'assets/css/**/*.scss',
    ],

    whitelistPatterns: [
      /(tippy|vue-slider|cropper|tui|color-picker|swal2|introjs|nuxt)/,
      /(text|top|bottom|editor|only|fixed|filter|apply|tie|triangle)/,
      /(body|html|pre|svg)/,
    ],
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

  /**
   * Enable the profiler in WebpackBar.
   */
  profile: analyze,

  /*
   ** Build configuration
   */
  build: {
    /**
     * Visualize bundles and how to optimize them.
     */
    analyze,

    /**
     * Enable thread-loader in webpack building.
     */
    parallel: true,

    /**
     * Enables the HardSourceWebpackPlugin for improved caching.
     */
    hardSource: cache,

    /**
     * Enable cache of terser-webpack-plugin and cache-loader.
     */
    cache,

    /**
     * Enables Common CSS Extraction using Vue Server Renderer guidelines.
     */
    extractCSS: false,

    /**
     * Customize Babel configuration for JavaScript and Vue files.
     */
    babel: {
      sourceType: 'unambiguous',

      presets: [
        [
          '@babel/preset-env',
          {
            debug: false,
            targets: {
              chrome: '78',
            },
            modules: false,
            useBuiltIns: 'usage',
            corejs: {
              version: 3,
            },
          },
        ],
      ],

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
     * Customize options of Nuxt.js integrated webpack loaders.
     * https://nuxtjs.org/api/configuration-build#loaders
     */
    loaders: {
      scss: dev ? {
        implementation: require('sass'),
      } : {},

      vue: {
        prettify: false,
      },

      imgUrl: {
        limit: 10 * 1000,
      },
    },

    /**
     * Webpack Optimization.
     * https://nuxtjs.org/api/configuration-build#optimization
     */
    optimization: {
      splitChunks: {
        name: false,
        automaticNameMaxLength: 30,
        maxSize: 500 * 1000,

        cacheGroups: {
          // Disable the built-in cacheGroups.
          default: false,

          commons: {
            name: 'commons',
            priority: 10,
            test: /node_modules[\\/](vue|vue-loader|vue-router|vuex|vue-meta|core-js|@babel\/runtime|axios|webpack|setimmediate|timers-browserify|process|regenerator-runtime|cookie|js-cookie|is-buffer|dotprop|nuxt\.js)[\\/]/,
            chunks: 'all',
          },

          vendors: {
            name: 'vendors',
            test: /node_modules[\\/]/,
            priority: 20,
            chunks: 'all',
          },

          modules: {
            name: 'modules',
            test: /(modules|workers|mixins|)[\\/]/,
            priority: 30,
            chunks: 'all',
          },
        },
      },
    },

    postcss: {
      plugins: {
        tailwindcss: './tailwind.config.js',
      },
    },

    /*
     ** You can extend webpack config here.
     */
    extend(config, { isDev }) {
      config.target = 'electron-renderer'

      // Don't throw warning when asset created is over 250kb
      config.performance.hints = false

      // Disable handling of requires with a single expression.
      config.module.exprContextCritical = false

      config.module.rules.push({
        test: /\.worker\.js$/,
        use: {
          loader: 'worker-loader',
          options: {
            name: ({ isDev }) => (isDev ? '[name].[ext]' : 'workers/[contenthash:7].[ext]'),
          },
        },
        exclude: /(node_modules)/,
      })

      config.module.rules.push({
        test: /\.(ogg|mp3|wav|mpe?g)$/i,
        use: {
          loader: 'file-loader',
          options: {
            name: ({ isDev }) => (isDev ? '[name].[ext]' : 'sounds/[contenthash:7].[ext]'),
          },
        },
      })

      config.devtool = 'source-map'

      if (!isDev) {
        config.output.publicPath = './_nuxt/'
      }
    },
  },
}
