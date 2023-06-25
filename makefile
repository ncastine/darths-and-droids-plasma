# Packaging and installation tool for our KDE comic for plugin

# Base name of our comic package, without version
name := darths_and_droids

# Build output directory
build_dir := build

# Read current version from source metadata
version := $(shell grep X-KDE-PluginInfo-Version= src/metadata.desktop | cut -d = -f 2)

# Full name of package file to build, including version, but without path
file := $(name)_$(version).comic

# Package our comic in Zip format required by KDE.
# Descends into "src" in order to exclude it from final path within Zip.
package:
	mkdir -p $(build_dir)
	cd src && zip -r ../$(build_dir)/$(file) .

# Install our comic package with KDE for the current user
install: package
	kpackagetool5 -t Plasma/Comic -i $(build_dir)/$(file)

# Remove any versions of our comic package from KDE for current user
uninstall:
	kpackagetool5 -t Plasma/Comic -i $(name)

clean:
	rm -rf $(build_dir)
