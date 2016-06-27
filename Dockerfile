FROM centos:7
RUN yum update -y
RUN yum install -y kde-workspace kdeplasma-addons
RUN mkdir /var/run/dbus # Required to run DBus
RUN dbus-uuidgen > /etc/machine-id
RUN dbus-daemon --system --fork
RUN kbuildsycoca4
VOLUME /plasma/app
ADD runPlasmoid.sh /bin/runPlasmoid.sh
CMD ["/bin/runPlasmoid.sh", "comic", "/plasma/app"]
