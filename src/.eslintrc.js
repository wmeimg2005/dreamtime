module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    mocha: true
  },
  globals: {
    $provider: false,
    AppError: false,
    LogEvent: false,
    Warning: false,
    Exception: false,
    consola: false
  },
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2020,
    allowImportExportEverywhere: true
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended',
    'airbnb-base',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:promise/recommended',
    'plugin:lodash/recommended',
    'plugin:vue/recommended',
    'plugin:mocha/recommended'
  ],
  plugins: [
    'nuxt',
    'import',
    'promise',
    'lodash',
    'vue',
    'mocha'
  ],
  rules: {
    'import/named': 'error',
    'import/no-cycle': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-webpack-loader-syntax': 'off',
    'import/order': 'error',
    'import/prefer-default-export': 'off',
    'import/no-duplicates': 'off',
    'lodash/import-scope': ['error', 'member'],
    'lodash/prefer-constant': 'off',
    'lodash/prefer-immutable-method': 'warn',
    'lodash/prefer-includes': 'warn',
    'lodash/prefer-lodash-method': 'off',
    'lodash/prefer-lodash-typecheck': 'warn',
    'lodash/prefer-noop': 'off',
    'lodash/prefer-spread': 'off',
    'vue/no-v-html': 'off',
    'vue/singleline-html-element-content-newline': 'warn',
    'vue/html-closing-bracket-newline': ['warn', { multiline: 'never', singleline: 'never' }],
    'vue/max-attributes-per-line': ['warn', {
      'singleline': 1,
      'multiline': {
        'max': 1,
        'allowFirstLine': true
      }
    }],
    'nuxt/no-cjs-in-config': 'off',
    'nuxt/no-globals-in-created': 'off',
    'linebreak-style': 'error',
    'max-len': ['warn', { code: 120 }],
    'no-await-in-loop': 'warn',
    'no-continue': 'off',
    'no-param-reassign': 'off',
    'no-restricted-globals': 'warn',
    'no-restricted-syntax': 'off',
    'no-trailing-spaces': 'warn',
    'no-tabs': 'error',
    'no-undef': 'warn',
    'class-methods-use-this': 'off',
    'comma-dangle': 'warn',
    'func-names': 'off',
    'global-require': 'off',
    'prefer-arrow-callback': 'off',
    'no-underscore-dangle': ['error', { allowAfterThis: true }],
    'object-shorthand': ['error', 'always'],
    'padded-blocks': ['error', 'never'],
    'prefer-spread': 'off',
    'promise/no-callback-in-promise': 'off',
    'quote-props': ['error', 'as-needed'],
    'spaced-comment': 'warn',
    'quotes': ['error', 'single'],
    'semi': ['error', 'never']
  },
  settings: {
    'import/resolver': {
      nuxt: {},
      node: {},
      webpack: {}
    }
  }
}
