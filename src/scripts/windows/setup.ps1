Set-Location ../../cli

#
# DreamPower.
# Deep learning algorithm capable of nudify people photos.
#
# Requirements:
# * Python 3.6.2+
# * CUDA 10.0
#

# PyInstaller will allow us to compile and package everything in a simple .exe
python3 -m pip --no-cache-dir install pyinstaller --user

# This command should resolve and install all the necessary packages
python3 -m pip --no-cache-dir install -r requirements-windows.txt --user

# NOTES from wisp101:
# Make sure pyinstaller is accessible from the cmdline as "pyinstaller".
# Otherwise, track down its folder and add it to your path. I found mine in "~/.local/bin".

Set-Location ../

#
# DreamTime.
# Friendly user interface for DreamPower.
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

Write-Output "Installation completed!"
Write-Output "- Now you can run the dev-start.ps1 script to start modifying the GUI and see the changes in real time."
Write-Output "- Now you can run the build.ps1 script to compile the project and get an easy-to-use .exe"
