#!/bin/sh

./build.sh

# Copy our runner script into location that will be mounted
cp runPlasmoid.sh build/run.sh

# Need KDE "developer" image that includes Plasmoid Viewer.
# Use wrapper script that allows Xorg forwarding from Docker.
./dockerX11.sh -v `pwd`/build:/home/darths kdeneon/plasma:developer sh /home/darths/run.sh
