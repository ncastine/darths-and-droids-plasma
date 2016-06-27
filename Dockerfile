FROM centos:7
VOLUME /plasma/app
RUN yum update -y
RUN yum install -y kde-workspace kdeplasma-addons
RUN mkdir /var/run/dbus # Required to run DBus
RUN dbus-uuidgen > /etc/machine-id
RUN dbus-daemon --system --fork
RUN kbuildsycoca4
CMD plasmapkg -t comic -i /plasma/app && sleep 5 && kbuildsycoca4 && sleep 5 && plasma-windowed comic && /bin/bash
