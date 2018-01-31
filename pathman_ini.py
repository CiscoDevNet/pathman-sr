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

    Updated:
    - 20161204, Niklas, Added MyBGP to get SIDs from bgp-rib
    - 20180131, Niklas, Fixed crash for missing link-ip
    
    
    """

sid_saves = 'static_sids.json'

#odl_ip = '127.0.0.1'
odl_ip = '198.18.1.80'
odl_port = '8181'
log_file = '/tmp/pathman.log'
log_size = 2000000
log_count = 3
log_level = 'INFO'
odl_user = 'admin'
odl_password = 'admin'

import requests, json, logging

class MyBGP(object):

    def __init__(self, method='http', controller_ip=odl_ip, controller_port=odl_port, user=odl_user, passw=odl_password):
        '''note to self: add dict for item type
            self.dict['flavor']['list']
            self.dict['images']['index']
            '''
        temp_dict = {'list':[], 'index':[]}
        self.token = ''
        self.ip = controller_ip
        self.user = user
        self.password = passw
        self.dicts = {  'nodes':{'list':[], 'index':[]},
                        'prefixes':{'list':[], 'index':[]},
                        'links':{'list':[], 'index':[]},

        }
        url = '{}://{}:{}/restconf/operational/bgp-rib:bgp-rib/rib/example-bgp-rib/loc-rib/tables/bgp-linkstate:linkstate-address-family/bgp-linkstate:linkstate-subsequent-address-family/linkstate-routes'
        self.url = url.format(method, controller_ip, controller_port)
        self.creds = {'username':user,'password':passw}
        self.status = 0
        self.error = ""

        result = self._get_url(self.url, headers={'content-type': 'application/json'})
        if result:
            linkstate = result.json()
            for link in linkstate[u'bgp-linkstate:linkstate-routes']['linkstate-route']:
                if 'node-descriptors' in link.keys():
                    self.dicts['nodes']['list'].append(link)
                elif 'prefix-descriptors' in link.keys():
                    if 'sr-prefix' in link['attributes']['prefix-attributes'].keys():
                        self.dicts['prefixes']['list'].append(link)
                elif 'link-descriptors' in link.keys():
                    self.dicts['links']['list'].append(link)
                else:
                    logging.error('unexpected item: {}'.format(link))

            self.dicts['nodes']['index'] = [node['attributes'].get('node-attributes', {}).get('ipv4-router-id', '0.0.0.0') for node in self.dicts['nodes']['list']]
            self.dicts['prefixes']['index'] = [prefix['prefix-descriptors']['ip-reachability-information'] for prefix in self.dicts['prefixes']['list']]
            self.dicts['links']['index'] = [link['link-descriptors'].get('ipv4-interface-address', '0.0.0.0') for link in self.dicts['links']['list']]

        else:
            logging.info('Nothing retrieved')

    def _get_url(self, url, headers):
        '''common get function'''
        try:
            response =  requests.get(url, headers = headers, auth=(self.user,self.password), verify=False)
            logging.info("status code: %s"% response.status_code)
            if response.status_code in [200, 202, 204]:
                return response
            else:
                logging.error("Error code: %s, %s" %(response.status_code, response.text))

        except requests.exceptions.ConnectionError, e:
            logging.error('Connection Error to %s: %s' % (self.ip, e.message))

        return

    def _delete_url(self, url, headers):
        try:
            response =  requests.delete(url, headers = headers)
            logging.info("status code: %s"% response.status_code)
            if response.status_code in [200, 202, 204]:
                return response
            else:
                logging.error("Error code: %s, %s" %(response.status_code, response.text))
        except requests.exceptions.ConnectionError, e:
            logging.error('Connection Error to %s: %s' % (self.ip, e.message))
        return

    def _post_url(self, url, data, headers):
        try:
            response =  requests.post(url, data=data, headers = headers)
            return response
        except requests.exceptions.ConnectionError, e:
            logging.error('Connection Error to %s: %s' % (self.ip, e.message))
            return

    def item_details(self, item, name):
        '''get details for a service'''
        try:
            index = self.dicts[item]['index'].index(name)
            return self.dicts[item]['list'][index]
        except ValueError:
            return

    def get_sr_info_old(self):
        sr_info = {}
        for node in self.dicts['nodes']['list']:
            base = node['attributes']['node-attributes']['sr-capabilities']['local-label']
            loopback = node['attributes']['node-attributes']['ipv4-router-id']
            prefix = self.item_details('prefixes', loopback + '/32')
            label = prefix['attributes']['prefix-attributes']['sr-prefix']['local-label']
            sr_info.update({loopback: int(base) + int(label)})
        return sr_info

    def get_sr_info(self):
        sr_info = {}
        for node in self.dicts['nodes']['list']:
            base = node['attributes'].get('node-attributes', {}).get('sr-capabilities', {}).get('local-label',)
            if base:
                loopback = node['attributes'].get('node-attributes', {}).get('ipv4-router-id', )
                if loopback:
                    prefix = self.item_details('prefixes', loopback + '/32')

                    if any(x in prefix['attributes']['prefix-attributes']['sr-prefix'].keys() for x in ['local-label', 'sid']):
                        if 'local-label' in prefix['attributes']['prefix-attributes']['sr-prefix'].keys():
                            label = prefix['attributes']['prefix-attributes']['sr-prefix']['local-label']
                        else:
                            label = prefix['attributes']['prefix-attributes']['sr-prefix']['sid']
                        sr_info.update({loopback: int(base) + int(label)})
                    else:
                        logging.error('no sid info')
        return sr_info

# Bye bye
