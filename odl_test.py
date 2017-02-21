#! /usr/bin/env python2.7
"""
    * Copyright (c) 2016 by Cisco Systems, Inc.
    * All rights reserved.

    odl_test.py
    - get a quick check on PCEP, BGP and Netconf from your ODL controller

    Niklas Montin, 20161212, niklas@cisco.com

    """
import argparse
import sys
import json
import logging
from pathman_sr import LOGGING
from netconf import pcep_test, bgp_test, netconf_test, controller

version = '1.0'


def nprint(mydict):
    print json.dumps(mydict, sort_keys=True,indent=4, separators=(',', ': '))


def print_pcep(name=None):
    reply = pcep_test(name)
    nprint(reply)


def print_bgp(name=None, address=None):
    reply = bgp_test(name, address)
    nprint(reply)


def print_netconf(name=None):
    reply = netconf_test(name)
    nprint(reply)


if __name__ == '__main__':
    LOGGING['root']['handlers'] = ['console','logtofile']
    logging.config.dictConfig(LOGGING)
    logging.info("This is initializing the automation log")

    logging.captureWarnings(True)

    p = argparse.ArgumentParser(
        prog=sys.argv[0],
        description='Test BGP, PCEP and Netconf output ODL Controller',
        version=version,
        epilog='Copyright (c) 2017 by Cisco Systems, Inc. All Rights Reserved'
        )

    subp = p.add_subparsers(help='commands', dest='command')

    pcep_p = subp.add_parser("pcep", help='print pcep output')
    pcep_p.add_argument('--address', type=str, help='address of node to list')

    bgp_p = subp.add_parser("bgp", help='print bgp output')
    bgp_p.add_argument('--name', type=str, help='name of node to list')
    bgp_p.add_argument('--address', type=str, help='address of node to list')

    netconf_p = subp.add_parser("netconf", help='list netconf nodes')
    netconf_p.add_argument('--name', type=str, help='name of node to list')

    p.add_argument('--controller_ip', default=controller['odl_ip'], type=str, help='ODL Controller ip address')
    p.add_argument('--controller_port', default=controller['odl_port'], type=str, help='ODL port')
    p.add_argument('--user', default=controller['any_user'], type=str, help='ODL user')
    p.add_argument('--password', default=controller['any_pass'], type=str, help='ODL password')

    ns = p.parse_args()
    logging.info("Parser: %s" % ns)

    if ns.controller_ip:
        controller['odl_ip'] = ns.controller_ip
    if ns.controller_port:
        controller['odl_port'] = ns.controller_port
    if ns.user:
        controller['any_user'] = ns.user
        # odl_user = ns.user
    if ns.password:
        controller['any_pass'] = ns.password

    if ns.command == 'pcep':
        print_pcep(ns.address)

    elif ns.command == 'bgp':
        print_bgp(ns.name, ns.address)

    elif ns.command == 'netconf':
        print_netconf(ns.name)

# Bye bye
