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
    ],

    link: [
      {
        rel: 'preload',
        href: 'https://rsms.me/inter/inter.css',
        as: 'style',
        onload: 'this.rel = \'stylesheet\'',
      },
    ],
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
    '~/plugins/vue-portal.js',
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
    // Doc: https://github.com/nuxt-community/style-resources-module
    '@nuxtjs/style-resources',
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
  styleResources: {
    scss: '~/assets/css/utilities/all.scss',
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
            targets: {
              chrome: '78',
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
      imgUrl: {
        limit: 5 * 1000,
      },
    },

    /**
     * Webpack Optimization.
     * https://nuxtjs.org/api/configuration-build#optimization
     */
    /* optimization: {
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
    }, */

    postcss: {
      plugins: {
        tailwindcss: './tailwind.config.js',
      },
    },

    /*
     ** You can extend webpack config here.
     */
    extend(config, ctx) {
      //
      config.target = 'electron-renderer'

      // Don't throw warning when asset created is over 250kb
      config.performance.hints = false

      // Disable handling of requires with a single expression.
      config.module.exprContextCritical = false

      //
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

      //
      config.module.rules.push({
        test: /\.(ogg|mp3|wav|mpe?g)$/i,
        use: {
          loader: 'file-loader',
          options: {
            name: ({ isDev }) => (isDev ? '[name].[ext]' : 'sounds/[contenthash:7].[ext]'),
          },
        },
      })

      //
      config.module.rules.push({
        test: /\.ya?ml$/,
        use: ['js-yaml-loader'],
      })

      //
      config.devtool = 'source-map'

      if (!ctx.isDev) {
        config.output.publicPath = './_nuxt/'
      }
    },
  },
}
