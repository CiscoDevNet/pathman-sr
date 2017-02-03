# NETCONF Tool

## Overview
Pathman_SR originally used NETCONF to find node SIDs. (Now BGP RIB is tried first)
As netconf is somewhat complex to get going, I have build a helper tool.

And if efforts fail, you can also add SIDs statically via the set_static_sid.py

## Configuration
Configuration is shared with pathman_sr and is in pathman_ini.py
```
odl_ip = '198.18.1.80'
odl_port = '8181'
odl_user = 'admin'
odl_password = 'admin'
```


## netconf.py cli

Help is available through --help
```
$ ./netconf.py --help
usage: ./netconf.py [-h] [-v] [--controller_ip CONTROLLER_IP]
                    [--controller_port CONTROLLER_PORT] [--user USER]
                    [--password PASSWORD]
                    {add,delete,list,static} ...

Add, List and Remove nodes from ODL Netconf

positional arguments:
  {add,delete,list,static}
                        commands
    add                 add a node to netconf
    delete              delete a node from netconf
    list                list netconf nodes
    static              add static SR ID to pathman_sr

optional arguments:
  -h, --help            show this help message and exit
  -v, --version         show program's version number and exit
  --controller_ip CONTROLLER_IP
                        ODL Controller ip address
  --controller_port CONTROLLER_PORT
                        ODL port
  --user USER           ODL user
  --password PASSWORD   ODL password

Copyright (c) 2015 by Cisco Systems, Inc. All Rights Reserved
$
```

### Add

```
$ ./netconf.py add --help
usage: ./netconf.py add [-h] --name NAME --address ADDRESS [--port PORT]
                        [--device_user DEVICE_USER]
                        [--device_password DEVICE_PASSWORD]

optional arguments:
  -h, --help            show this help message and exit
  --name NAME           name of node to add
  --address ADDRESS     device ip address
  --port PORT           device netconf port [830]
  --device_user DEVICE_USER
                        device username [admin]
  --device_password DEVICE_PASSWORD
                        device password [admin]
$
```


### Delete

```
$ ./netconf.py delete --help
usage: ./netconf.py delete [-h] --name NAME

optional arguments:
  -h, --help   show this help message and exit
  --name NAME  name of node to delete

$
```

### List

```
$ ./netconf.py list --help
usage: ./netconf.py list [-h] [--name NAME]

optional arguments:
  -h, --help   show this help message and exit
  --name NAME  name of node to list
$
```

### Static

```
$ ./netconf.py static --help
usage: ./netconf.py static [-h] [--name NAME] [--ip IP] [--sid SID]

optional arguments:
  -h, --help   show this help message and exit
  --name NAME  name of node
  --ip IP      loopback ip of node
  --sid SID    SR ID of node

 $
 ```




### Examples for netconf:
```
./netconf.py list
./netconf.py list —-name sjc
./netconf.py add —-name alb --address 198.18.1.30
./netconf.py delete --name nyc
```




