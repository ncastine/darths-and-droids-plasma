#!/bin/sh
# For use within a KDE 5 Docker container.
# Installs our comic and opens the viewer.

# Enable QML debug for all widgets in system log
kwriteconfig5 --file ~/.config/QtProject/qtlogging.ini --group "Rules" --key "qml.debug" "true"

# Register the comic
kpackagetool5 -t Plasma/Comic -i /home/darths/*.comic

# Run the comic viewer
QT_LOGGING_RULES="qml.debug=true" plasmoidviewer -a org.kde.plasma.comic > /home/darths/comic.log &

# File browser to view what is in the container.
# Will shutdown when closed.
dolphin
