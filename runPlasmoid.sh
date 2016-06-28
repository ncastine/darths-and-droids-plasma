#!/bin/sh

APPLET=$1
PKG_SRC=$2

ls -l $PKG_SRC

# Need to open the window first, or our plugin package will not be available
# to it
plasma-windowed $APPLET

plasmapkg -t $APPLET -i $PKG_SRC

kbuildsycoca4 --noincremental

# Window above would close if script were to exit
/bin/bash
