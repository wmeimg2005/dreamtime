/* eslint-disable no-template-curly-in-string */
require('dotenv').config()
const pkg = require('./package.json')

module.exports = {
  appId: 'com.dreamnet.dreamtime',
  productName: process.env.APP_NAME,
  copyright: 'Copyright (C) DreamNet. All rights reserved.',
  directories: {
    output: '../dist',
  },
  files: [
    '!**/node_modules/*/{CHANGELOG.md,README.md,README,readme.md,readme}',
    '!**/node_modules/*/{test,__tests__,tests,powered-test,example,examples}',
    '!**/node_modules/*.d.ts',
    '!**/node_modules/.bin',
    '!**/*.{iml,o,hprof,orig,pyc,pyo,rbc,swp,csproj,sln,xproj,vscode,env.example,eslintrc.json,prettierrc,tgz}',
    '!.editorconfig',
    '!**/._*',
    '!**/{.DS_Store,.git,.hg,.svn,CVS,RCS,SCCS,.gitignore,.gitattributes}',
    '!**/{__pycache__,thumbs.db,.flowconfig,.idea,.vs,.nyc_output}',
    '!**/{appveyor.yml,.travis.yml,circle.yml}',
    '!**/{npm-debug.log,yarn.lock,.yarn-integrity,.yarn-metadata.json}',
    '!**/{components,cli,layouts,middleware,mixins,pages,patches,plugins,scripts,store,third,nucleus.json,tailwind.config.js}',
  ],
  extraFiles: [
    {
      from: '.env',
      to: '.env',
    },
  ],
  win: {
    target: 'nsis',
    extraResources: [
      {
        from: 'node_modules/regedit/vbs',
        to: 'vbs',
      },
      {
        from: 'node_modules/7zip-bin/win/x64',
        to: '7zip-bin',
      },
    ],
  },
  linux: {
    target: 'snap',
    executableName: process.env.APP_NAME,
    synopsis: pkg.description,
    category: 'Graphics',
    extraResources: [
      {
        from: 'node_modules/7zip-bin/linux/x64',
        to: '7zip-bin',
      },
    ],
  },
  mac: {
    target: 'dmg',
    darkModeSupport: true,
    category: 'public.app-category.graphics-design',
    minimumSystemVersion: '10.15.0',
    extraResources: [
      {
        from: 'node_modules/7zip-bin/mac',
        to: '7zip-bin',
      },
    ],
    extraFiles: [
      {
        from: '.env',
        to: 'MacOS/.env',
      },
    ],
  },
  nsis: {
    oneClick: false,
    perMachine: false,
    allowToChangeInstallationDirectory: true,
    uninstallDisplayName: '${productName}',
    deleteAppDataOnUninstall: true,
    displayLanguageSelector: true,
    menuCategory: true,
    artifactName: '${productName}-v${version}-windows.${ext}',
  },
  snap: {
    plugs: ['default', {
      'personal-files': { read: ['$HOME'], write: ['$HOME'] },
    }],
    artifactName: '${productName}-v${version}-linux.${ext}',
  },
  dmg: {
    title: '${productName}',
    artifactName: '${productName}-v${version}-macos.${ext}',
    backgroundColor: '#000',
  },
}
