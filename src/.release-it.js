module.exports = {
  hooks: {
    'before:init': ['yarn lint', 'yarn build'],
    'before:github:release': [
      'git config user.email "developers@dreamnet.tech"',
      'git config user.name "DreamNet"'
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
    draft: true
  }
}
