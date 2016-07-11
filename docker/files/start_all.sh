#! /bin/bash
service sshd start 
su -l cisco -c '/home/cisco/backend.sh > /tmp/backend.log 2>&1 &'

