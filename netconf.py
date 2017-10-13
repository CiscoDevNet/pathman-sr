#! /usr/bin/env python2.7
"""
    * Copyright (c) 2015 by Cisco Systems, Inc.
    * All rights reserved.

    netconf.py from odl_gateway.py

    Niklas Montin, 20150311, niklas@cisco.com
    20161212, Niklas, Added parser for netconf utils
    """


import requests
from requests.auth import HTTPBasicAuth
import json
import logging
from pathman_sr import LOGGING, html_style
from pathman_ini import odl_ip, odl_port, odl_user, odl_password
import sys
import argparse


version = '1.1'
# =====================================================
access = 'local'
access_methods = ('local', 'connected', 'remote')

# controller = {'odl_ip':'198.18.1.25','odl_port':'8181'}
# odl_user = 'admin'
# odl_password = 'admin'

controller = {'odl_ip': odl_ip,
              'odl_port': odl_port,
              'access': access,
              'any_user': odl_user,
              'any_pass': odl_password}

'''
controller = {'odl_ip':'64.100.10.32',
              'odl_port':'6644',
              'access': 'remote',
              'any_user': 'v74user1',
              'any_pass': '6720cc'}
                '''


# Example: alb = {'name': 'alb', 'address': '198.18.1.30', 'username': 'cisco', 'password': 'cisco'}
# ============================================================

odl_version_list = [
    {'nitrogen': {'name': 'odl-bmp-monitor-config', 'revision': '2017-05-17'}},
    {'carbon': {'name': "aaa-encrypt-service-config", 'revision': "2016-09-15"}},
    {'boron': {'name': "openconfig-interfaces", 'revision': "2016-04-12"}},
    {'beryllium': {'name': "odl-rsvp-parser-spi-cfg", 'revision':"2015-08-26"}},
    {'lithium': {'name': "aaa-authn-model", 'revision': "2014-10-29"}},
    {'helium': {'name': "opendaylight-topology", 'revision': "2013-10-30"}},
]

uri_version = '/restconf/modules'
uri_topo = '/restconf/operational/network-topology:network-topology/topology/example-linkstate-topology'
uri_pcep_topo = '/restconf/operational/network-topology:network-topology/topology/pcep-topology'
uri_module = '/restconf/config/opendaylight-inventory:nodes/node/controller-config/yang-ext:mount/config:modules/'
uri_nodelist = '/restconf/config/opendaylight-inventory:nodes'
uri_node_topo = '/restconf/operational/network-topology:network-topology/topology/topology-netconf'
uri_netconf_node = '/restconf/operational/network-topology:network-topology/topology/topology-netconf/node/{name}'
uri_netconf_topo = '/restconf/config/network-topology:network-topology/topology/topology-netconf/node/{name}'
uri_netconf_node_old = '/restconf/operational/opendaylight-inventory:nodes/node/{name}'
uri_netconf_del = '/restconf/config/opendaylight-inventory:nodes/node/controller-config/yang-ext:mount/config:modules/module/odl-sal-netconf-connector-cfg:sal-netconf-connector/{name}'

access_head = {
        'local'     : 'http://{odl_ip}:{odl_port}',
        'connected' : 'https://token:{token}@{odl_ip}/controller',
        'remote'    : 'https://token:{token}@{odl_ip}:{odl_port}/controller'
}
token_head = {
        'local': '',
        'connected' : 'https://{odl_ip}/controller-auth',
        'remote'    : 'https://{odl_ip}:{odl_port}/controller-auth'
}



add_node = '''<module xmlns="urn:opendaylight:params:xml:ns:yang:controller:config">
    <type xmlns:prefix="urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf">prefix:sal-netconf-connector</type>
    <name>{name}</name>
    <address xmlns="urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf">{address}</address>
    <port xmlns="urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf">830</port>
    <username xmlns="urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf">{username}</username>
    <password xmlns="urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf">{password}</password>
    <tcp-only xmlns="urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf">false</tcp-only>
    <event-executor xmlns="urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf">
    <type xmlns:prefix="urn:opendaylight:params:xml:ns:yang:controller:netty">prefix:netty-event-executor</type>
    <name>global-event-executor</name>
    </event-executor>
    <binding-registry xmlns="urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf">
    <type xmlns:prefix="urn:opendaylight:params:xml:ns:yang:controller:md:sal:binding">prefix:binding-broker-osgi-registry</type>
    <name>binding-osgi-broker</name>
    </binding-registry>
    <dom-registry xmlns="urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf">
    <type xmlns:prefix="urn:opendaylight:params:xml:ns:yang:controller:md:sal:dom">prefix:dom-broker-osgi-registry</type>
    <name>dom-broker</name>
    </dom-registry>
    <client-dispatcher xmlns="urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf">
    <type xmlns:prefix="urn:opendaylight:params:xml:ns:yang:controller:config:netconf">prefix:netconf-client-dispatcher</type>
    <name>global-netconf-dispatcher</name>
    </client-dispatcher>
    <processing-executor xmlns="urn:opendaylight:params:xml:ns:yang:controller:md:sal:connector:netconf">
    <type xmlns:prefix="urn:opendaylight:params:xml:ns:yang:controller:threadpool">prefix:threadpool</type>
    <name>global-netconf-processing-executor</name>
    </processing-executor>
    </module>'''

add_node_boron = '''<node xmlns="urn:TBD:params:xml:ns:yang:network-topology">
    <node-id>{name}</node-id>
    <host xmlns="urn:opendaylight:netconf-node-topology">{address}</host>
    <port xmlns="urn:opendaylight:netconf-node-topology">830</port>
    <username xmlns="urn:opendaylight:netconf-node-topology">{username}</username>
    <password xmlns="urn:opendaylight:netconf-node-topology">{password}</password>
    <tcp-only xmlns="urn:opendaylight:netconf-node-topology">false</tcp-only>
    <keepalive-delay xmlns="urn:opendaylight:netconf-node-topology">120</keepalive-delay>
    </node>'''


def set_head(head, controller):
    """supply the correct header - simplified"""
    if 'access' in controller.keys():
        if set([controller['access']]).issubset(access_methods):
            logging.info("odl access method: %s" % controller['access'])
            return  head[controller['access']].format(**controller)
    return '127.0.0.1:8181'


def version_check():
    """modified from odl_gateway"""
    head = set_head(access_head, controller)
    url = head + uri_version

    success, result = get_url(url)

    if success:
        name_list = [mod['name'] for mod in result['modules']['module']]
        rev_list = [mod['revision'] for mod in result['modules']['module']]
        for odl_ver in odl_version_list:
            version = odl_ver.keys()[0]
            if odl_ver[version]['name'] in name_list:
                if odl_ver[version]['revision'] == rev_list[name_list.index(odl_ver[version]['name'])]:
                    logging.info("Found ODL Release: %s" % version)
                    return version
    return ""


def netconf_list(dummy=None):
    head = set_head(access_head, controller)
    odl_version = version_check()

    if odl_version in ['beryllium', 'boron', 'carbon', 'nitrogen']:
        url = head + uri_node_topo
    else:
        url = head + uri_nodelist

    success, result = get_url(url)
    conf_list = []
    if success:
        if isinstance(result, dict):
            if 'nodes' in result.keys():
                try:
                    for node in result['nodes']['node']:
                        conf_list.append(node['id'])
                except:
                    logging.error("format error in netconf node-list: %s" % str(result))
                    pass
            elif 'topology' in result.keys():
                try:
                    for node in result['topology'][0]['node']:
                        conf_list.append(node['node-id'])
                except:
                    logging.error("format error in netconf node-list: %s" % str(result))
                    pass
    return conf_list


def add_netconf_node(node_dict):
    head = set_head(access_head, controller)

    # Need to make this a global check - once per session, not once per node
    odl_version = version_check()
    if odl_version in ['boron', 'carbon', 'nitrogen']:
        url = head + uri_netconf_topo.format(**node_dict)
        success, result = put_xml(url, add_node_boron.format(**node_dict))
    else:
        url = head + uri_module
        success, result = post_xml(url, add_node.format(**node_dict))

    if success:
        logging.info("Added: %s" % node_dict['name'])
    else:
        logging.error("Fail to add: {}, cause: {}".format(node_dict['name'], result))
    return success


def del_netconf_node(node_dict):
    head = set_head(access_head, controller)

    # Need to make this a global check - once per session, not once per node
    odl_version = version_check()
    if odl_version in ['boron', 'carbon', 'nitrogen']:
        url = head + uri_netconf_topo.format(**node_dict)
    else:
        url = head + uri_netconf_del.format(**node_dict)

    success, result = del_url(url)

    if success:
        logging.info("Deleted: %s" % node_dict['name'])
    else:
        logging.error("Failed to delete: %s" % node_dict['name'])
    return success


def get_url(url):
    '''request url'''
    headers = {'Content-type': 'application/json'}
    auth = (controller['any_user'], controller['any_pass'])
    logging.info(url)
    try:
        response = requests.get(url, headers=headers, auth=auth, verify=False)
        logging.info("Url GET Status: %s" % response.status_code)

        if response.status_code in [200]:
            return True, response.json()
        else:
            return False, str(response.text)
    except requests.exceptions.ConnectionError, e:
        logging.error('Connection Error: %s' % e.message)
        return False, str(e.message)

def del_url(url):
    '''request url'''
    headers = {'Content-type': 'application/json'}
    auth = (controller['any_user'], controller['any_pass'])
    try:
        response = requests.delete(url, headers=headers, auth=auth, verify=False)
        logging.info("Url DEL Status: %s" % response.status_code)

        if response.status_code in [200]:
            return True, response
        else:
            return False, str(response.text)
    except requests.exceptions.ConnectionError, e:
        logging.error('Connection Error: %s' % e.message)
        return False, str(e.message)


def post_xml(url, data):
    '''request post'''
    headers = {'Content-type': 'application/xml'}
    auth = (controller['any_user'], controller['any_pass'])
    try:
        response =  requests.post(url, data=data, auth=auth, headers=headers, verify=False)
        logging.info("Url POST Status: %s" % response.status_code)
        if response.status_code in [200, 204]:
            if len(response.text) > 0:
                return True, response.json()
            else:
                return True, {}
        else:
            return False, str(response.text)
    except requests.exceptions.ConnectionError, e:
        logging.error('Connection Error: %s' % e.message)
        return False, str(e.message)


def put_xml(url, data):
    """request post"""
    headers = {'Content-type': 'application/xml'}
    auth = (controller['any_user'], controller['any_pass'])
    try:
        response = requests.put(url, data=data, auth=auth, headers=headers, verify=False)
        logging.info("Url PUT Status: %s" % response.status_code)
        if response.status_code in [200, 201, 204]:
            if len(response.text) > 0:
                return True, response.json()
            else:
                return True, {}
        else:
            return False, str(response.text)
    except requests.exceptions.ConnectionError, e:
        logging.error('Connection Error: %s' % e.message)
        return False, str(e.message)


def put_json(url, data):
    """request post"""
    headers = {'Content-type': 'application/json'}
    auth = (controller['any_user'], controller['any_pass'])
    try:
        response =  requests.put(url, data=json.dumps(data), auth=auth, headers=headers, verify=False)
        logging.info("Url PUT Status: %s" % response.status_code)
        if response.status_code in [200, 204]:
            if len(response.text) > 0:
                return True, response.json()
            else:
                return True, {}
        else:
            return False, str(response.text)
    except requests.exceptions.ConnectionError, e:
        logging.error('Connection Error: %s' % e.message)
        return False, str(e.message)


def netconf_test(name=None):
    def get_node(node):
        success, result = get_url(head+test_url.format(**node))
        logging.info("Get netconf from node: %s, result: %s" % (node['name'], success))
        if success:
            result_list.append(result)
        return

    head = set_head(access_head, controller)
    netconf_nodes = netconf_list(head+uri_nodelist)
    num_nodes = len(netconf_nodes)
    logging.info('Netconf nodes found: %s' % num_nodes)

    dict_list = [{'name': node} for node in netconf_nodes]
    result_list = []
    test_list = []
    found = False

    odl_version = version_check()
    logging.info('Odl Version: %s' % odl_version)

    if odl_version in ['helium']:
        test_url = uri_netconf_node_old
        node_id = 'id'
        connected = 'netconf-node-inventory:connected'
        capability = 'netconf-node-inventory:initial-capability'
    else:
        test_url = uri_netconf_node
        node_id = 'node-id'
        connected = 'netconf-node-topology:connection-status'
        capability = 'netconf-node-topology:available-capabilities'

    for node in dict_list:
        if name:
            if node['name'] == name:
                get_node(node)
                # success, result = get_url(head+test_url.format(**node))
                #logging.info("Get netconf from node: %s, result: %s" % (node['name'], success))
                found = True
                break
        else:
            get_node(node)

    for result in result_list:
        name = result['node'][0][node_id]
        temp = {name:{'status':result['node'][0][connected]}}
        if result['node'][0][connected] in ['connected', 'true']:
            if 'netconf-node-topology:host' in result['node'][0].keys():
                temp[name].update({'address':result['node'][0]['netconf-node-topology:host']})
            if 'netconf-node-inventory:initial-capability' in result['node'][0].keys():
                temp[name].update({'initial-capability':len(result['node'][0]['netconf-node-inventory:initial-capability'])})
            if 'netconf-node-topology:available-capabilities' in result['node'][0].keys():
                if 'available-capability' in result['node'][0]['netconf-node-topology:available-capabilities'].keys():
                    temp[name].update({'available-capability':len(result['node'][0]['netconf-node-topology:available-capabilities']['available-capability'])})
            if 'netconf-node-topology:unavailable-capabilities' in result['node'][0].keys():
                if 'unavailable-capability' in result['node'][0]['netconf-node-topology:unavailable-capabilities'].keys():
                    excuse_dict = {}
                    for excuse in result['node'][0]['netconf-node-topology:unavailable-capabilities']['unavailable-capability']:
                        if excuse['failure-reason'] in excuse_dict.keys():
                            excuse_dict[excuse['failure-reason']] +=1
                        else:
                            excuse_dict.update({excuse['failure-reason']:1})
                    temp[name].update({'unavailable-capability':excuse_dict})
        logging.info(temp)
        test_list.append(temp)

    return {'netconf-test':{'number_of_nodes:': num_nodes, 'results':test_list}}


def bgp_test(name=None, address=None):
    def node_test(node):
        tnode= {'router-id':"missing"}
        if 'l3-unicast-igp-topology:igp-node-attributes' in node.keys():

            if 'router-id' in node['l3-unicast-igp-topology:igp-node-attributes'].keys():
                tnode= {'router-id': node['l3-unicast-igp-topology:igp-node-attributes']['router-id']}
            else:
                 logging.error('router-id missing')

            if 'name' in node['l3-unicast-igp-topology:igp-node-attributes'].keys():
                tnode.update({'name': node['l3-unicast-igp-topology:igp-node-attributes']['name']})

        try:
            node_dict = html_style(node['node-id'])
            tnode.update({'node-id': node_dict['router']})
        except:
            logging.error('node-id or router keywords missing: %s' % node)

        node_ports = []
        if 'termination-point' in node.keys():
            for link in node['termination-point']:
                #logging.debug("port: %s " % link['tp-id'])
                if 'tp-id' in link.keys():
                    port_dict = html_style(link['tp-id'])
                    if 'ipv4' in port_dict.keys():
                        node_ports.append(port_dict['ipv4'])
        tnode.update({'ports': node_ports})
        return tnode

    head = set_head(access_head, controller)
    success, result = get_url(head+uri_topo)
    temp = {}
    if success and set(['node', 'link']).issubset(set(result['topology'][0].keys())):
        topo = result['topology'][0]
        temp = {topo['topology-id']:{'number_of_nodes':len(topo['node']), 'number_of_links': len(topo['link'])}}
        node_list = []
        for node in topo['node']:
            if name:
                if 'name' in node['l3-unicast-igp-topology:igp-node-attributes'].keys() and node['l3-unicast-igp-topology:igp-node-attributes']['name'] == name:
                    tnode = node_test(node)
                    node_list.append(tnode)
            elif address:
                if 'router-id' in node['l3-unicast-igp-topology:igp-node-attributes'].keys() and address in node['l3-unicast-igp-topology:igp-node-attributes']['router-id']:
                    tnode = node_test(node)
                    node_list.append(tnode)
            else:
                tnode = node_test(node)
                node_list.append(tnode)
        temp[topo['topology-id']].update({'nodes':node_list})
    else:
        logging.error('No BGP-LS info')
    return temp


def pcep_test(address=None):
    def node_test(node):
        tnode = {"node-id":node['node-id']}
        lsp_num = 0
        if 'network-topology-pcep:path-computation-client' in node.keys():
            if 'ip-address' in node['network-topology-pcep:path-computation-client'].keys():
                tnode.update({"ip-address":node['network-topology-pcep:path-computation-client']['ip-address']})
            if 'reported-lsp' in node['network-topology-pcep:path-computation-client'].keys():
                for path in node['network-topology-pcep:path-computation-client']['reported-lsp']:
                    lsp_num +=1
        if lsp_num != 0:
            tnode.update({'LSPs':lsp_num})
        return tnode, lsp_num

    head = set_head(access_head, controller)
    success, result = get_url(head+uri_pcep_topo)
    temp = {}
    lsp_sum = 0
    if success:
        topo = result['topology'][0]
        temp = {topo['topology-id']:{'number_of_nodes':len(topo['node'])}}
        node_list = []
        for node in topo['node']:
            if address:
                if 'network-topology-pcep:path-computation-client' in node.keys():
                    if 'ip-address' in node['network-topology-pcep:path-computation-client'].keys():
                        if address == node['network-topology-pcep:path-computation-client']['ip-address']:
                            tnode, lsp_num = node_test(node)
                            node_list.append(tnode)
            else:
                tnode, lsp_num = node_test(node)
                node_list.append(tnode)
                lsp_sum += lsp_num
        if lsp_sum >0:
            temp[topo['topology-id']].update({'network LSPs': lsp_sum})
        temp[topo['topology-id']].update({'nodes': node_list})
    return temp


def display_list(name=None):
    netconf_dict = netconf_test(name)
    # {'netconf-test': {'number_of_nodes:': 16, 'results':
    found = False
    for node in netconf_dict['netconf-test']['results']:
        if name:
            if name == node.keys()[0]:
                print "name: %s, status: %s, address: %s" % (name, node[name]['status'], node[name].get('address'))
                found = True
        else:
            node_name = node.keys()[0]
            print "name: %s, status: %s, address: %s" % (node_name, node[node_name]['status'], node[node_name].get('address'))
    if name and not found:
        print "name: %s - not found" % name

if __name__ == '__main__':
    # LOGGING['root']['handlers'] = ['console','logtofile']
    logging.config.dictConfig(LOGGING)
    logging.info("This is initializing the automation log")

    logging.captureWarnings(True)

    p = argparse.ArgumentParser(
        prog=sys.argv[0],
        description='Add, List and Remove nodes from ODL Netconf',
        version=version,
        epilog='Copyright (c) 2017 by Cisco Systems, Inc. All Rights Reserved'
        )

    subp = p.add_subparsers(help='commands', dest='command')

    add_p = subp.add_parser("add", help='add a node to netconf')
    add_p.add_argument('--name', required=True, type=str, help='name of node to add')
    add_p.add_argument('--address', required=True, type=str, help='device ip address')
    add_p.add_argument('--port', default='830', type=str, help='device netconf port [830]')
    add_p.add_argument('--device_user', default='cisco', type=str, help='device username [admin]')
    add_p.add_argument('--device_password', default='cisco', type=str, help='device password [admin]')

    del_p = subp.add_parser("delete", help='delete a node from netconf')
    del_p.add_argument('--name', required=True, type=str, help='name of node to delete')

    list_p = subp.add_parser("list", help='list netconf nodes')
    list_p.add_argument('--name', type=str, help='name of node to list')

    static_sid = subp.add_parser("static", help='add static SR ID to pathman_sr')
    static_sid.add_argument('--name', type=str, help='name of node')
    static_sid.add_argument('--ip', type=str, help='loopback ip of node')
    static_sid.add_argument('--sid', type=str, help='SR ID of node')

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

    if ns.command == 'add':
        print "adding: {}, success: {}".format(ns.name,
                                               add_netconf_node(
                                                   {'name': ns.name,
                                                    'address': ns.address,
                                                    'port': ns.port,
                                                    'username': ns.device_user,
                                                    'password': ns.device_password}))
    elif ns.command == 'delete':
        print "deleting: {}, success: {}".format(ns.name,
                                                 del_netconf_node({'name': ns.name}))
    elif ns.command == 'list':
        print "we are listing"
        display_list(ns.name)

# Bye bye
