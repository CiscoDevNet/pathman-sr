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
# Import third party library modules.
import tornado.ioloop
import tornado.web
import tornado.httpserver

from pathman50 import *
from pathman_ini import *

Response_Flag = True
response_list = []

# for certs
data_dir = ''


class CommandHandler2(tornado.web.RequestHandler):
    """Class to handle received API commands."""
    
    def post(self):
        """Examine POST request and react to subcommands."""
        request = self.request
        list_subreplies = []
        dict_subreply = {}
        
        for reply in response_list:
            
            #dict_subreply.append(reply)
            
            list_subreplies.append(reply)
        
        dict_reply = {}
        dict_reply['response'] = list_subreplies
        self.write(dict_reply)
        #nprint(json.dumps(dict_reply), Response_Flag)
        logging.info(json.dumps(dict_reply))

    def initialize(self, debug):
        """Save desired debug level."""
        self.__debug = debug
        #nprint('Init 2 done - debug saved', debug=debug)
        logging.info('Init 2 done - debug saved')

    def prepare(self):
        """Log the command request."""
        global Response_Flag
        global response_list
        
        debug = self.__debug
        request = self.request
        self.set_header("Access-Control-Allow-Origin", "*")
        try:
            json_body = request.body
            dict_body = json.loads(json_body)
            
            list_subcommands = dict_body['request']
            response_list = rest_interface_parser(list_subcommands, debug)
        
        except SyntaxError, e:
            response_list = [{'success' :False,
                             'cause': "SyntaxError: %s"% e.message ,
                             'option': 'unknown'}]
        
        except KeyError, e:
            response_list = [{'success' :False,
                             'cause': "KeyError: %s"% e.message ,
                             'option': 'unknown'}]
        
        except ValueError, e:
            response_list = [{'success' :False,
                             'cause': "ValueError: %s"% e.message ,
                             'option': 'unknown'}]



# Bye bye.
