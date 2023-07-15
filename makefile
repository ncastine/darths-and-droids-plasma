# Packaging and installation tool for our KDE comic for plugin

# Base name of our comic package, without version
name := darths_and_droids

# Build output directory
build_dir := build

# Read current version from source metadata.
# Simple method that does not require actual JSON parser.
version := $(shell grep '"Version"' src/metadata.json | sed 's/.*: *"//' | sed 's/".*//')

# Full name of package file to build, including version, but without path
file := $(name)_$(version).comic

# KDE 5/current "developer" image has Plasmoid Viewer, good for quick test
docker_image := kdeneon/plasma:developer

# Package our comic in Zip format required by KDE.
# Descends into "src" in order to exclude it from final path within Zip.
package:
	mkdir -p $(build_dir)
	cd src && zip -r ../$(build_dir)/$(file) contents/**/*.js metadata.* *.png

# Install our comic package with KDE for the current user
install: package
	kpackagetool5 -t Plasma/Comic -i $(build_dir)/$(file)

# Remove any versions of our comic package from KDE for current user
uninstall:
	kpackagetool5 -t Plasma/Comic -r $(name)

# Run the comic in a temporary Docker container. Does NOT save state.
docker: package
	cp runComicStrip.sh $(build_dir)
	./dockerX11.sh -v `pwd`/$(build_dir):/home/darths $(docker_image) sh /home/darths/runComicStrip.sh

clean:
	rm -rf $(build_dir)
