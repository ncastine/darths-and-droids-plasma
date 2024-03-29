#!/bin/bash
# Run graphical app in Docker with X11. Works on Mac and Linux.
# Example usage: ./dockerX11.sh kdeneon/plasma:developer dolphin

# Workaround for OSX XQuartz private socket
if [ `uname` == "Darwin" ]; then
    which socat 2>&1 > /dev/null

    if [ $? -ne 0 ]; then
        echo You must install socat
        echo If you already have Homebrew, simply: brew install socat
        echo Otherwise, visit the project homepage http://brew.sh
        exit 1
    fi

    # Mac IP, display num, and socket notes from -
    # http://stackoverflow.com/questions/16296753/can-you-run-gui-apps-in-a-docker-container

    # Get our local IP address
    IP_ADDR=$(ifconfig en0 | grep "inet " | awk '{print $2}')

    # Make random display number so multiple instances of the container can
    # run concurrently
    DISP_NUM=$(jot -r 1 100 200)

    PORT_NUM=$((6000 + DISP_NUM)) # Base X11 port is 6000

    socat TCP-LISTEN:${PORT_NUM},reuseaddr,fork UNIX-CLIENT:\"$DISPLAY\" 2>&1 > /dev/null &

    DISPLAY=${IP_ADDR}:${DISP_NUM}
else
    PRIV_FLAG="--privileged"
fi

# X11 forwarding notes from -
# https://dzone.com/articles/docker-x11-client-via-ssh
docker run $PRIV_FLAG --env="DISPLAY" \
    --volume="$HOME/.Xauthority:/root/.Xauthority:rw" \
    --volume=/tmp/.X11-unix:/tmp/.X11-unix $*

if [ `uname` == "Darwin" ]; then
    kill %1 # Kill the socat job launched above
fi
