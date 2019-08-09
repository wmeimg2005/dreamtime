Set-Location ../../cli

#
# DreamPower.
# Deep learning algorithm capable of nudify people photos.
#
# Requirements:
# * Python 3.6 and pip3
#

# PyInstaller will begin to compile the script and package
# everything necessary in a directory with the final .exe
# Relax and enjoy your coffee :)

#python3 -m pip uninstall torchvision torch -y
python3 -m pip --no-cache-dir install https://download.pytorch.org/whl/cpu/torch-1.1.0-cp36-cp36m-win_amd64.whl --user
python3 -m pip --no-cache-dir install https://download.pytorch.org/whl/cpu/torchvision-0.3.0-cp36-cp36m-win_amd64.whl --user

pyinstaller main.py -y --onedir --name "dreampower" --distpath "../../dist" --add-binary "../third/msvcp/msvcp140.dll;."

#

Set-Location ../gui

#
# GUI.
# A wrapper of the CLI that offers a graphical interface so that its use is as simple as possible.
#
# Requirements:
# * NodeJS 10+
# * Yarn
#

# electron-build will begin to compile the NuxtJS project
# Relax more and enjoy more your coffee :))

yarn build

#

Set-Location ../../dist

# We need to move the generated folder to the final folder

if ( Test-Path ./gui ) {
  Remove-Item ./gui -recurse -Force
}

if ( Test-Path ./cli ) {
  Remove-Item ./cli -recurse -Force
}

Move-Item ./gui-unpacked/win-unpacked ./gui -Force
Move-Item ./dreampower ./cli -Force

# We delete the generated folder

#Remove-Item –path ./gui-unpacked -recurse -Force

#
# Success
#

Write-Output ("Build completed!")
Write-Output ("It should have generated a folder called dist/, inside you will find the final project files that you can share with everyone!")
Write-Output ("Enjoy and remember to respect the License!")