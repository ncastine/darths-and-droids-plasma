FROM centos:7
RUN yum update -y
RUN yum install -y kde-workspace kdeplasma-addons
RUN mkdir /var/run/dbus # Required to run DBus
VOLUME /plasma/app
CMD dbus-uuidgen > /etc/machine-id && dbus-daemon --system --fork && plasmapkg -t comic -i /plasma/app && kbuildsycoca4 && plasma-windowed comic
