const path = require('path')
const fs = require('fs')

const baseDirPath = path.dirname(path.dirname(__dirname))

const guiDirPath = path.join(
  baseDirPath,
  'dist',
  'gui-unpacked',
  'win-unpacked'
)

const finalGuiDirPath = path.join(baseDirPath, 'dist', 'gui')

if (!fs.existsSync(guiDirPath)) {
  throw new Error(
    `The GUI directory was not found, the compilation has failed? ${guiDirPath}`
  )
}

if (fs.existsSync(finalGuiDirPath)) {
  fs.unlinkSync(finalGuiDirPath)
}

fs.renameSync(guiDirPath, finalGuiDirPath)

fs.unlinkSync(path.join(baseDirPath, 'dist', 'gui-unpacked'))
