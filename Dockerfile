FROM phanect/kubuntu:14.04
VOLUME /plasma/app
ADD runPlasmoid.sh /runPlasmoid.sh
CMD ["/bin/bash", "-l", "-c", "/runPlasmoid.sh comic /plasma/app/"]
