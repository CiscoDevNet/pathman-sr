#! /usr/bin/env python2.7
"""
    * Copyright (c) 2016 by Cisco Systems, Inc.
    * All rights reserved.
    
    Pathman init file
    
    Niklas Montin, 20141209, niklas@cisco.com
    

    odl_ip - ip address of odl controller
    odl_port -  port for odl rest on controller
    log_file - file to write log to - level INFO default
    log_size - max size of logfile before it rotates
    log_count - number of backup version of the log
    log_level - controls the the logging depth, chnage to 'DEBUG' for more detail
    odl_user - username for odl controller restconf access
    odl_password - password for odl controller restconf access
    
    
    """
#odl_ip = '127.0.0.1'
odl_ip = '198.18.1.80'
odl_port = '8181'
log_file = '/tmp/pathman.log'
log_size = 2000000
log_count = 3
log_level = 'INFO'
odl_user = 'admin'
odl_password = 'admin'
