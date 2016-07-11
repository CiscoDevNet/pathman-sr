#! /bin/sh
# Add user cisco and make sudo
useradd --home-dir /home/cisco --user-group --password cisco --shell /bin/bash --create-home cisco
echo cisco | passwd --stdin cisco
echo "cisco ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers
#gpasswd -a cisco wheel
