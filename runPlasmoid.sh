#!/bin/sh
# For use within a KDE 5 Docker container.
# Installs our comic and opens the viewer.

# Register the comic that we provided via Docker volume mount
kpackagetool5 -t Plasma/Comic -i /home/darths/*.comic

# Run the comic viewer
plasmoidviewer -a org.kde.plasma.comic &

# File browser to view what is in the container.
# Docker will shutdown when this browser closed.
dolphin
