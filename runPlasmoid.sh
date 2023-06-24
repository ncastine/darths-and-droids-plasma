#!/bin/sh
# For use within a KDE 5 Docker container.
# Installs our comic and opens the viewer.

whoami
pwd
ls -l
ls -l /home/darths
kpackagetool5 -t Plasma/Comic -i /home/darths/*.comic
plasmoidviewer -a org.kde.plasma.comic &
dolphin
