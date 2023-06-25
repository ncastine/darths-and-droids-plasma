#!/bin/sh
# Create a package that can be used by KDE Plasma Comics application.

# Descend into source directory so top level is excluded from Zip
cd src

# Read version number from metadata file
VERSION=$(grep X-KDE-PluginInfo-Version= metadata.desktop | cut -d = -f 2)

echo Building package version $VERSION

FILE="darths_and_droids_$VERSION.comic"

mkdir -p ../build

zip -r ../build/$FILE contents/code/main.es metadata.* vader.*

cd ..

echo Built package build/$FILE
