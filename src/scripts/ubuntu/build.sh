#!/bin/bash

cd ../../cli

#
# DreamPower.
# Deep learning algorithm capable of nudify people photos.
#
# Requirements:
# * Python 3.6.2+
# * CUDA 10.0
#

# PyInstaller will begin to compile the script and package
# everything necessary in a directory with the final binary
# Relax and enjoy your coffee :)

pyinstaller main.py -y --onedir --name "cli" --distpath "../../dist"

#

cd ../gui

#
# DreamTime.
# Friendly user interface for DreamPower.
#
# Requirements:
# * NodeJS 10+
# * Yarn
#

# Electron-build will begin to compile the NuxtJS project
# and place everything necessary in a directory with the final binary
# Relax more and enjoy more your coffee :))

yarn build

#
# Success
#

echo "Build completed!"
echo "It should have generated a folder called dist/, inside you will find the final project files that you can share with everyone!"
echo "Enjoy and remember to respect the License!"
