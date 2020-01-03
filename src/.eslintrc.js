module.exports = {
  env: {
    browser: true,
    node: true,
    mocha: true
  },
  extends: [
    "@nuxtjs",
    "airbnb-base",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:promise/recommended",
    "plugin:lodash/recommended",
    "plugin:vue/recommended",
    "plugin:nuxt/recommended",
    "plugin:mocha/recommended"
  ],
  globals: {
    $provider: false,
    AppError: false,
    LogEvent: false,
    Warning: false,
    Exception: false,
    consola: false
  },
  parserOptions: {
    parser: "babel-eslint",
    allowImportExportEverywhere: true
  },
  plugins: [
    "import",
    "promise",
    "lodash",
    "vue",
    "mocha"
  ],
  root: true,
  rules: {
    "no-param-reassign": "off",
    "class-methods-use-this": "off",
    "no-trailing-spaces": "warn",
    "comma-dangle": "warn",
    "global-require": "off",
    "import/default": "warn",
    "import/no-webpack-loader-syntax": "off",
    "import/order": ['error'],
    "import/prefer-default-export": "off",
    "import/no-extraneous-dependencies": "off",
    "import/named": "warn",
    "import/no-cycle": "off",
    "promise/no-callback-in-promise": "off",
    "promise/catch-or-return": "off",
    "linebreak-style": "warn",
    "new-parens": "off",
    "lodash/import-scope": [
      "off",
      "member"
    ],
    "lodash/prefer-constant": "off",
    "lodash/prefer-immutable-method": "warn",
    "lodash/prefer-includes": "warn",
    "lodash/prefer-lodash-method": "off",
    "lodash/prefer-lodash-typecheck": "warn",
    "lodash/prefer-noop": "off",
    "lodash/prefer-spread": "off",
    "import/extensions": "off",
    "max-len": "off",
    "func-names": "off",
    "no-await-in-loop": "warn",
    "no-console": "warn",
    "no-continue": "off",
    "no-debugger": "error",
    "no-lone-blocks": "error",
    "no-restricted-globals": "warn",
    "no-restricted-syntax": "off",
    "no-shadow": "off",
    "no-underscore-dangle": [
      "error",
      {
        allowAfterThis: true
      }
    ],
    "no-unreachable": "warn",
    "no-unused-vars": "warn",
    "no-useless-constructor": "warn",
    "nuxt/no-globals-in-created": "off",
    "object-shorthand": [
      "error",
      "always"
    ],
    "padded-blocks": [
      "error",
      "never"
    ],
    "prefer-spread": "off",
    "quote-props": [
      "error",
      "as-needed"
    ],
    quotes: [
      "error",
      "single",
      {
        allowTemplateLiterals: true
      }
    ],
    semi: [
      "error",
      "never"
    ],
    "spaced-comment": "warn",
    "vue/html-closing-bracket-newline": [
      "warn",
      {
        multiline: "never",
        singleline: "never"
      }
    ],
    "vue/html-indent": [
      "warn",
      2
    ],
    "vue/html-self-closing": "error",
    "vue/no-v-html": "off",
    "vue/singleline-html-element-content-newline": "warn",
    'nuxt/no-cjs-in-config': 'off'
  },
  settings: {
    "import/resolver": {
      nuxt: {},
      node: {},
      webpack: {}
    }
  }
}
