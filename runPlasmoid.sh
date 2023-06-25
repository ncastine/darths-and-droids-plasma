#!/bin/sh
# For use within a KDE 5 Docker container.
# Installs our comic and opens the viewer.

ls -l /home/darths
kpackagetool5 -t Plasma/Comic -i /home/darths/*.comic
plasmoidviewer --help-all
plasmoidviewer -a org.kde.plasma.comic
