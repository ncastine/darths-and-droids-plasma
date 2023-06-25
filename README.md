# Darths &amp; Droids Plasma Comic Plugin

Designed for the Comic Strip viewer in [KDE](https://kde.org "KDE Community Home") Plasma desktop.

With Docker you may build and test (to some extent) the plugin on Mac OS.

## Testing on Mac OS

### Install Dependencies

1. GNU `make` utility or equivalent
2. [Docker Desktop](https://www.docker.com/products/docker-desktop)
3. [XQuartz](https://www.xquartz.org)
5. Use [Homebrew](https://brew.sh) to install SOcket CAT multipurpose relay: `brew install socat`

### Run the Docker Image

```
./dockerRun.sh
```

The above command will use Docker to run the KDE Comic viewer in a minimalist session.
Via X11 forwarding you should be able to see the application presented within your Mac desktop.
Click the _Configure..._ button and then click the checkbox next to *Darths &amp; Droids* in order to activate the comic. 

In the minimalist environment you will not have full access to all the features of the Comic viewer.
The `~/.xsession-errors` file is not populated without a full X Session.
You will want to load KDE on a Linux VM if you need robust debugging.

For some level of debug within Docker you can set `ENABLE_DEBUG = true` in [main.js](src/contents/code/main.js).
Doing so will prefix some log statements to the Alt text that appears over the comic images.
