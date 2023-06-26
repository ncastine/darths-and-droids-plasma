#!/bin/sh
# Entry point for a KDE 5 Docker container. Runs the Comic Strip app.

# Register the comic that we provided via Docker volume mount
kpackagetool5 -t Plasma/Comic -i /home/darths/*.comic

# Run the comic viewer
plasmoidviewer -a org.kde.plasma.comic &

# File browser to view what is in the container.
# Docker will shutdown when this browser is closed by user.
dolphin
