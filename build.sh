#!/bin/sh
# Create a package that can be used by KDE Plasma Comics application.

# Descend into source directory so top level is excluded from Zip
pushd src

# Read version number from metadata file
VERSION=$(grep X-KDE-PluginInfo-Version= metadata.desktop | cut -d = -f 2)

echo Building package version $VERSION

FILE="darths_and_droids_$VERSION.comic"

zip -r ../$FILE contents/code/main.es metadata.desktop vader.ico

popd

echo Built package $FILE
