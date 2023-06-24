# Darths &amp; Droids Plasma Comic Plugin

This is compatible with the Comics viewer in [KDE](https://kde.org/ "KDE Community Home") 4.x Plasma desktop.

Thanks to Docker you can build and test the plugin on Mac OS.

## Testing on Mac OS

### Install Dependencies

1. [Docker Desktop](https://www.docker.com/products/docker-desktop)
2. [XQuartz](https://www.xquartz.org/)
3. [Homebrew](https://brew.sh/)
4. Use Brew to install SOcket CAT relay: `brew install socat`

### Build the Comic Package

```
./build.sh
```

### Run the Docker Image

```
./dockerRun.sh
```

The above command will use Docker to run KDE.
Then via X11 forwarding you should be able to see the Comic Strip application presented within your Mac desktop.
Click the _Configure..._ button and then click the checkbox next to *Darths &amp; Droids* in order to activate the comic. 
