module.exports = {
  hooks: {
    'before:init': [
      'git config user.email "developers@dreamnet.tech"',
      'git config user.name "DreamNet"',
      'yarn lint',
      'yarn build'
    ]
  },

  git: {
    requireUpstream: false,
    commit: false,
    push: false,
    tag: true,
    tagName: 'v${version}',
    tagAnnotation: 'v${version}'
  },

  npm: {
    publish: false
  },

  github: {
    release: true,
    releaseName: 'v${version}',
    preRelease: true,
    draft: true,
    tagName: 'v${version}'
  }
}
