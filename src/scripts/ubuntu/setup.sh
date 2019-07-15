#!/bin/bash

cd ../../cli

#
# CLI.
# The CLI is where the neural network is located.
#
# Requirements:
# * Python 3.6 and pip3
# * CUDA 10.0
#

# PyInstaller will allow us to compile and package everything in a simple binary
python3 -m pip --no-cache-dir install pyinstaller --user

# This command should resolve and install all the necessary packages
python3 -m pip --no-cache-dir install -r requirements-ubuntu.txt --user

# NOTES from wisp101:
# Make sure pyinstaller is accessible from the cmdline as "pyinstaller".
# Otherwise, track down its folder and add it to your path. I found mine in "~/.local/bin".

cd ../gui

#
# GUI.
# A wrapper of the CLI that offers a graphical interface so that its use is as simple as possible.
#
# Requirements:
# * NodeJS 10+
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
echo "- Now you can run the dev-start.bat script to start modifying the GUI and see the changes in real time."
echo "- Now you can run the build.bat script to compile the project and get an easy-to-use binary"