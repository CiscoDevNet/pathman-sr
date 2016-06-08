#! /usr/bin/env python2.7
"""
    * Copyright (c) 2014 by Cisco Systems, Inc.
    * All rights reserved.
    
    Rest command server
    -- used for various tasks
    -- here for running the Pathman REST API
    
    Maintainer: Niklas Montin (niklas@cisco.com)
    20140710 - v1   basic command support, based on work by vrpolak@cisco.com
    20140716 - v2   SSL support and other http extras
    20140728 - v3   Adopted to Pathman
    20140824 - v4   Commandhandler2
    20141120 - v5   Removed need for Launcher - main section added
    20160413 - v6   Split out the actual handler to work with pathman and pathman_sr at the same time
    """
__author__ = 'niklas'
# Import standard Python library modules.
import json
import copy
import re

import time
import logging

# Import third party library modules.
import tornado.ioloop
import tornado.web
import tornado.httpserver

from pathman_ini import *
from server_sr import CommandHandlerSR,  LOGGING, build_odl_topology
#from server_pathman import CommandHandler2

Response_Flag = True
response_list = []

# for certs
data_dir = ''


class Commands(object):
    """ ioloop to pick up REST commands. """
    
    def __init__(self, port=None, uri=None, debug=False):
        """Create http server, register callbacks and start immediatelly."""
        
        #nprint(uri, debug=debug)
        re_uri = re.compile('/' + uri )
        txt_uri = re_uri.pattern
        re_uri_sr = re.compile('/pathman_sr' )
        txt_uri_sr = re_uri_sr.pattern
        
        build_odl_topology(debug=debug)
        
        logging.info('patterned to ' + repr(txt_uri))
        ##tuple_register2 = (txt_uri, CommandHandler2, dict(debug=debug))
        tuple_register_sr = (txt_uri_sr, CommandHandlerSR, dict(debug=debug))

        application = tornado.web.Application([ tuple_register_sr,  # For Pathman_sr backend
                                                #tuple_register2,  # For regular Pathman backend
                                                (r'/cisco-ctao/apps/(.*)', tornado.web.StaticFileHandler, {"path": "client"}),  # For UI
                                                #(r'/pathman/topology', dataHandler),  # For BGP APP
                                                ], dict(debug=debug))
        """
            http_server = tornado.httpserver.HTTPServer(application, ssl_options={
            "certfile": os.path.join(data_dir, "server.crt"),
            "keyfile": os.path.join(data_dir, "server.key"),
            })
            """

        #http_server.listen(int(port))
        application.listen(int(port))
        ioloop = tornado.ioloop.IOLoop.instance()
        #nprint('Pathman REST API Launched on port %s' % port, debug=debug)
        logging.info('Pathman REST API Launched on port %s' % port)
        ioloop.start()



if __name__ == "__main__":

    kwargs = {}
    kwargs['port'] = 8020
    kwargs['uri'] = 'pathman'

    kwargs['debug'] = True
    logging.config.dictConfig(LOGGING)
    #logging.config.fileConfig("pathman_logging.conf")
    logging.info('This is initializing the log')
    Commands(**kwargs)

# Bye bye.
