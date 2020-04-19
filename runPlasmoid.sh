#!/bin/sh
# Run a specific KDE Plasma application until the user closes it.
# First argument is the name of the application (e.g. comic).
# The second argument is the path to the plugin source code to run within the application.

APPLET=$1
PKG_SRC=$2

ls -l $PKG_SRC

# Need to open the window first, or our plugin package will not be available to it
plasma-windowed $APPLET

plasmapkg -t $APPLET -i $PKG_SRC

kbuildsycoca4 --noincremental

# Get process ID for the Plasma window launched above
PID=$(ps | grep plasma-windowed | awk '{print $1}')

# If the current script stops Docker will close.
# Wait until user closes the Plasma window.
tail --pid=$PID -f /dev/null
