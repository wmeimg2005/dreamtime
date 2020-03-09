module.exports = {
  extends: 'stylelint-config-sass-guidelines',
  plugins: ['stylelint-selector-bem-pattern'],
  // add your custom config here
  // https://stylelint.io/user-guide/configuration
  rules: {
    'plugin/selector-bem-pattern': {},
    'selector-class-pattern': null,
    'max-nesting-depth': 4,
    'selector-max-compound-selectors': 4,
  },
}
