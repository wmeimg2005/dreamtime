/* eslint-disable no-template-curly-in-string */

const pkg = require('./package.json')

/**
 * Windows Release
 */
const windows = {
  win: {
    target: process.env.BUILD_PORTABLE ? 'zip' : 'nsis',
    artifactName: '${productName}-v${version}-windows.${ext}',
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
  nsis: {
    oneClick: false,
    perMachine: false,
    allowToChangeInstallationDirectory: true,
    uninstallDisplayName: '${productName}',
    deleteAppDataOnUninstall: true,
    displayLanguageSelector: true,
    menuCategory: true,
  },
}

/**
 * Linux Release
 */
const linux = {
  linux: {
    target: process.env.BUILD_PORTABLE ? 'zip' : 'snap',
    artifactName: '${productName}-v${version}-ubuntu.${ext}',
    executableName: process.env.npm_package_name,
    synopsis: pkg.description,
    category: 'Graphics',
    extraResources: [
      {
        from: 'node_modules/7zip-bin/linux/x64',
        to: '7zip-bin',
      },
    ],
  },
}

/**
 * MacOS Release
 */
const macos = {
  mac: {
    target: process.env.BUILD_PORTABLE ? 'zip' : 'dmg',
    artifactName: '${productName}-v${version}-macos.${ext}',
    darkModeSupport: true,
    category: 'public.app-category.graphics-design',
    minimumSystemVersion: '10.15.0',
    extraResources: [
      {
        from: 'node_modules/7zip-bin/mac',
        to: '7zip-bin',
      },
    ],
  },
  dmg: {
    title: '${productName}',
    backgroundColor: '#000',
  },
}

/**
 * Electron Builder
 */
module.exports = {
  appId: 'com.dreamnet.dreamtime',
  productName: process.env.npm_package_displayName,
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
    '!**/{jsconfig.json,electron-builder.js,.eslintrc.js,.env-cmdrc.js,.codeclimate.yml,.babelrc,tailwind.config.js,nucleus.json}',
    '!{components,cli,layouts,middleware,mixins,pages,patches,plugins,scripts,store,third,coverage,.nuxt,test,workers}',
    '!{static,assets}',
    '!electron/src',
  ],
  extraFiles: [
    {
      from: '.env',
      to: '.env',
    },
    {
      from: 'package.min.json',
      to: 'package.json',
    },
  ],
  ...windows,
  ...linux,
  ...macos,
}
