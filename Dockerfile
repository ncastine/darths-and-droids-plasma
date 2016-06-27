FROM centos:7
RUN yum update -y
RUN yum install -y kde-workspace
RUN yum install -y xeyes
VOLUME /plasma/app
#CMD kbuildsycoca4 && plasmoidviewer comic
#CMD kbuildsycoca4 && yum whatprovides */plasmoidviewer
CMD /usr/bin/xeyes
