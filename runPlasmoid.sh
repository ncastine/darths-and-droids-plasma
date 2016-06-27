#!/bin/sh

APPLET=$1
PKG_SRC=$2

ls -l $PKG_SRC

kbuildsycoca4
plasmapkg -t $APPLET -i $PKG_SRC
sleep 5
kbuildsycoca4
sleep 10
plasma-windowed $APPLET
/bin/bash
