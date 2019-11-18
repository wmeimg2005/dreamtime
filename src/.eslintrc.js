module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
    "shared-node-browser": true
  },
  extends: [
    "@nuxtjs",
    "airbnb-base",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:promise/recommended",
    "plugin:lodash/recommended",
    "plugin:vue/recommended",
    "plugin:nuxt/recommended"
  ],
  globals: {
    $dream: false,
    $nucleus: false,
    $rollbar: false,
    $settings: false,
    $tools: false,
    AppError: false
  },
  parserOptions: {
    parser: "babel-eslint"
  },
  plugins: [
    "import",
    "promise",
    "lodash",
    "vue"
  ],
  root: true,
  rules: {
    "class-methods-use-this": "off",
    "comma-dangle": "warn",
    "import/default": "off",
    "import/no-webpack-loader-syntax": "off",
    "import/order": "error",
    "import/prefer-default-export": "off",
    "linebreak-style": "warn",
    "lodash/import-scope": [
      "warn",
      "member"
    ],
    "lodash/prefer-constant": "off",
    "lodash/prefer-immutable-method": "warn",
    "lodash/prefer-includes": "warn",
    "lodash/prefer-lodash-method": "off",
    "lodash/prefer-lodash-typecheck": "warn",
    "lodash/prefer-noop": "off",
    "max-len": "off",
    "no-await-in-loop": "warn",
    "no-console": "off",
    "no-continue": "off",
    "no-debugger": "error",
    "no-lone-blocks": "error",
    "no-param-reassign": "error",
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
    "vue/singleline-html-element-content-newline": "warn"
  },
  settings: {
    "import/resolver": {
      nuxt: {}
    }
  }
}
