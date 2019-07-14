#!/bin/bash

cd ../../gui

#
# GUI - NuxtJS Server
# This command starts the local NuxtJS server,
# the server will compile all the files of the interface
# and in case of making changes update them in real time.
#

sh yarn dev

#
# GUI - Electron App
# This command starts the Electron application,
# which is basically a web browser that will load
# the local server started previously.
#

sh yarn dev-gui
