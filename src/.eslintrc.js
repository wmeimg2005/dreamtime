module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2020: true,
    'shared-node-browser': true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: [
    '@nuxtjs',
    'airbnb-base',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:promise/recommended',
    'plugin:lodash/recommended',
    'plugin:vue/recommended',
    'plugin:nuxt/recommended'
  ],
  plugins: ['import', 'promise', 'lodash', 'vue'],
  settings: {
    'import/resolver': {
      nuxt: {}
    }
  },
  rules: {
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    semi: ['error', 'never'],
    'linebreak-style': 'off',
    'max-len': 'off',
    'comma-dangle': 'warn',
    'class-methods-use-this': 'off',
    'padded-blocks': ['error', 'never'],
    'no-await-in-loop': 'warn',
    'no-console': 'off',
    'no-continue': 'off',
    'no-restricted-syntax': 'off',
    'no-useless-constructor': 'warn',
    'no-underscore-dangle': ['error', { allowAfterThis: true }],
    'no-shadow': 'off',
    'no-unused-vars': 'warn',
    'no-debugger': 'warn',
    'no-restricted-globals': 'warn',
    'no-unreachable': 'warn',
    'no-lone-blocks': 'off',
    'no-param-reassign': 'off',
    'object-shorthand': ['error', 'always'],
    'quote-props': ['error', 'as-needed'],
    'spaced-comment': 'warn',
    'import/no-webpack-loader-syntax': 'off',
    'vue/no-v-html': 'off',
    'vue/html-indent': ['warn', 2],
    'vue/html-self-closing': 'error',
    'vue/singleline-html-element-content-newline': 'warn',
    'vue/html-closing-bracket-newline': [
      'warn',
      {
        singleline: 'never',
        multiline: 'never'
      }
    ],
    'lodash/import-scope': ['warn', 'full'],
    'lodash/prefer-lodash-method': 'off',
    'lodash/prefer-immutable-method': 'warn',
    'lodash/prefer-noop': 'off',
    'lodash/prefer-includes': 'warn',
    'lodash/prefer-lodash-typecheck': 'warn',
    'lodash/prefer-constant': 'off',
    'import/order': 'error',
    'import/prefer-default-export': 'off',
    'import/default': 'off',
    'import/no-extraneous-dependencies': [
      'off',
      {
        devDependencies: false,
        optionalDependencies: false,
        peerDependencies: false
      }
    ],
    'nuxt/no-globals-in-created': 'off'
  },
  globals: {
    $dream: false,
    $settings: false,
    $rollbar: false,
    $nucleus: false,
    $tools: false,
    AppError: false,
  },
}
