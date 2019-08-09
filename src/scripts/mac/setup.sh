#!/bin/bash

#
# Initial preparation
# by jesscold
#

brew unlink python

brew install https://raw.githubusercontent.com/Homebrew/homebrew-core/f2a764ef944b1080be64bd88dca9a1d80130c558/Formula/python.rb

brew install libomp

cd ../../cli

#
# DreamPower.
# Deep learning algorithm capable of nudify people photos.
#
# Requirements:
# * Python 3.6 and pip3
# * CUDA 10.0*
#

# PyInstaller will allow us to compile and package everything in a simple binary
python3 -m pip --no-cache-dir install pyinstaller --user

# This command should resolve and install all the necessary packages
python3 -m pip --no-cache-dir install -r requirements-mac.txt --user

# NOTES from wisp101:
# Make sure pyinstaller is accessible from the cmdline as "pyinstaller".
# Otherwise, track down its folder and add it to your path. I found mine in "~/.local/bin".

cd ../

#
# DreamTime.
# Friendly user interface for DreamPower.
#
# Requirements:
# * NodeJS (In theory any recent version works.)
# * Yarn
#

# This command should resolve and install all the necessary packages
yarn install

# NOTES:
# If you try to compile the program and you get an error message similar to:
# 'cross-env' is not recognized as an internal or external command
# then maybe you should restart your console or computer (the system is not detecting the packages that you just installed)
# Also be sure to check that Node and Yarn are correctly in the PATH

#
# Success
#

echo "Installation completed!"
echo "- Now you can run the dev-start.sh script to start modifying the GUI and see the changes in real time."
echo "- Now you can run the build.sh script to compile the project and get an easy-to-use binary"
