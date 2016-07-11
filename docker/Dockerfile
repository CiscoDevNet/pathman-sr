############################################################
# Dockerfile to build:
# BGP-Pathman App server
# Based on CentOS
############################################################

# Set the base image to CentOS
FROM centos:centos6.6

# File Author / Maintainer
MAINTAINER Niklas Montin

# Set locale
ENV     LC_ALL en_US.UTF-8

# Install dependencies
ENV     DEBIAN_FRONTEND noninteractive

# set baseurl for yum
RUN sed -i "s/#baseurl/baseurl/g" /etc/yum.repos.d/CentOS-Base.repo

# Install packages
RUN yum -y update \
        && yum -y install \
        xz \
        passwd \
        git \
        tar \
        wget \
        telnet \
        curl \
        dialog \
        net-tools \
        which \
        vim \
        make \
        gcc \
        cc-++ \
        python-tornado \
        python-requests \
        groupinstall \
        development \
        zlib-dev \
        openssl-devel \
        sqlite-devel \
        bzip2-devel \
        openssh-server \
        openssh-client \
        sudo

ADD /files /opt/files

RUN /opt/files/python_install.sh

RUN /opt/files/user_cisco.sh


# Set the default directory where CMD will execute
WORKDIR /opt
RUN su -l cisco -c 'git clone https://github.com/CiscoDevNet/pathman-sr' \
    && su -l cisco -c 'sed -i 's/localhost:8020/198.18.1.80:8021/g' /home/cisco/pathman-sr/client/pathman_sr/js/app.js' \
    && su -l cisco -c 'cp -p /opt/files/backend.sh /home/cisco' 

ENTRYPOINT /opt/files/start_all.sh && /bin/bash
