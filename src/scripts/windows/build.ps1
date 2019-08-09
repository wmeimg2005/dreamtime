Set-Location ../../cli

#
# DreamPower.
# Deep learning algorithm capable of nudify people photos.
#
# Requirements:
# * Python 3.6.2+
# * CUDA 10.0
#

# PyInstaller will begin to compile the script and package
# everything necessary in a directory with the final .exe
# Relax and enjoy your coffee :)

pyinstaller main.py -y --onedir --name "dreampower" --distpath "../../dist" --add-binary "../third/msvcp/msvcp140.dll;."

#

Set-Location ../

#
# DreamTime.
# Friendly user interface for DreamPower.
#
# Requirements:
# * NodeJS 10+
# * Yarn
#

# electron-build will begin to compile the NuxtJS project
# Relax more and enjoy more your coffee :))

yarn build

#
# Success
#

Write-Output ("Build completed!")
Write-Output ("It should have generated a folder called dist/, inside you will find the final project files that you can share with everyone!")
Write-Output ("Enjoy and remember to respect the License!")
