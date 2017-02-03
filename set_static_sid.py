#! /usr/bin/env python2.7
"""
    * Copyright (c) 2016 by Cisco Systems, Inc.
    * All rights reserved.

    set_static_sid.py
    - Add, Remove, List static SIDs to file that can be used instead of netconf for SID details.

    Niklas Montin, 20151212, niklas@cisco.com

    """

import logging
import sys
import argparse
from pathman_sr import LOGGING, file_to_dict, dict_to_file
from pathman_ini import sid_saves
# sid_list = 'static_sids.json'

version = '1.1'
# =====================================================


def sid_list(name=None, sid=None, address=None):
    def sid_print():
        print "Loopback: {}, name: {}, sid: {}".format(entry, sid_dict[entry]['name'], sid_dict[entry]['sid'])

    sid_dict = file_to_dict(sid_saves)
    for entry in sid_dict.keys():
        if name or sid or address:
            if name:
                if sid_dict[entry]['name'] == name:
                    sid_print()
            if address:
                if entry == address:
                    sid_print()
            if sid:
                if sid_dict[entry]['sid'] == sid:
                    sid_print()
        else:
            sid_print()


def sid_add(mdict):
    sid_dict = file_to_dict(sid_saves)
    sid_dict.update(mdict)
    dict_to_file(sid_dict, sid_saves)
    return True


def sid_delete(name=None, sid=None, address=None):
    def del_sid():
        temp = sid_dict.pop(entry)

        logging.info("removing: {}".format(temp))
        return True, temp.get('name')

    success = False
    sid_dict = file_to_dict(sid_saves)
    for entry in sid_dict.keys():
        if name or sid or address:
            if name:
                if sid_dict[entry]['name'] == name:
                    success, name = del_sid()
                    break
            if address:
                if entry == address:
                    success, name = del_sid()
                    break
            if sid:
                if sid_dict[entry]['sid'] == sid:
                    success, name = del_sid()
                    break
    if success:
        dict_to_file(sid_dict, sid_saves)
    return success, name

if __name__ == '__main__':
    # LOGGING['root']['handlers'] = ['console','logtofile']
    logging.config.dictConfig(LOGGING)
    logging.info("This is initializing the automation log")

    logging.captureWarnings(True)

    p = argparse.ArgumentParser(
        prog=sys.argv[0],
        description='Add, List and Remove SIDs from pathman_sr static file: "%s"' % sid_saves,
        version=version,
        epilog='Copyright (c) 2017 by Cisco Systems, Inc. All Rights Reserved'
        )

    subp = p.add_subparsers(help='commands', dest='command')

    add_p = subp.add_parser("add", help='add a node to sid_list')
    add_p.add_argument('--name', required=True, type=str, help='name of node to add')
    add_p.add_argument('--address', required=True, type=str, help='loopback ip address')
    add_p.add_argument('--sid', required=True, type=int, help='node SID')

    del_p = subp.add_parser("delete", help='delete a node from sid_list')
    del_p.add_argument('--name', type=str, help='name of node to delete')
    del_p.add_argument('--address', type=str, help='loopback ip address of node to delete')
    del_p.add_argument('--sid', type=int, help='node SID of node to delete')

    list_p = subp.add_parser("list", help='show sid_list')
    list_p.add_argument('--name', type=str, help='name of node to list')
    list_p.add_argument('--address', type=str, help='loopback ip address of node to list')
    list_p.add_argument('--sid', type=int, help='node SID of node to list')

    ns = p.parse_args()
    logging.info("Parser: %s" % ns)
    if ns.command == 'add':
        print "adding: {}, success: {}".format(ns.name, sid_add({ns.address: {'name': ns.name, 'sid': ns.sid}}))
    elif ns.command == 'delete':
        success, name = sid_delete(ns.name, ns.sid, ns.address)
        print "deleting: {}, success: {}".format(name, success)
    elif ns.command == 'list':
        print "we are listing"
        sid_list(ns.name, ns.sid, ns.address)

# Bye bye
