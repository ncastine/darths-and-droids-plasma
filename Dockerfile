FROM centos:7
RUN yum update -y
RUN yum install -y kde-workspace
RUN yum install -y xeyes
RUN mkdir /var/run/dbus # Required to run DBus
VOLUME /plasma/app
#CMD kbuildsycoca4 && plasmoidviewer comic
#CMD kbuildsycoca4 && yum whatprovides */plasmoidviewer
CMD dbus-uuidgen > /etc/machine-id && dbus-daemon --system --fork && /bin/bash
