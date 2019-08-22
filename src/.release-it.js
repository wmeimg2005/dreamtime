module.exports = {
  hooks: {
    'before:init': ['yarn lint', 'yarn build']
  },

  git: false,

  npm: false,

  github: {
    release: true,
    releaseName: 'v${version}',
    preRelease: true,
    draft: true,
    tagName: 'v${version}'
  }
}
