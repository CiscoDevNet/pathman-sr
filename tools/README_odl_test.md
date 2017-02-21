# ODL Test

## Overview
This is a collection of test commands to verify that your host can access ODL for bgp-linkstate, Netconf and PCEP.


## odl_test.py

```
$ ./odl_test.py --help
[INFO] <module>: This is initializing the automation log
usage: ./odl_test.py [-h] [-v] [--controller_ip CONTROLLER_IP]
                     [--controller_port CONTROLLER_PORT] [--user USER]
                     [--password PASSWORD]
                     {pcep,bgp,netconf} ...

Test BGP, PCEP and Netconf output ODL Controller

positional arguments:
  {pcep,bgp,netconf}    commands
    pcep                print pcep output
    bgp                 print bgp output
    netconf             list netconf nodes

optional arguments:
  -h, --help            show this help message and exit
  -v, --version         show program's version number and exit
  --controller_ip CONTROLLER_IP
                        ODL Controller ip address
  --controller_port CONTROLLER_PORT
                        ODL port
  --user USER           ODL user
  --password PASSWORD   ODL password

Copyright (c) 2017 by Cisco Systems, Inc. All Rights Reserved
$
```

## PCEP

```
$ ./odl_test.py pcep --help
[INFO] <module>: This is initializing the automation log
usage: ./odl_test.py pcep [-h] [--address ADDRESS]

optional arguments:
  -h, --help         show this help message and exit
  --address ADDRESS  address of node to list
$
```

## BGP

```
$ ./odl_test.py bgp --help
[INFO] <module>: This is initializing the automation log
usage: ./odl_test.py bgp [-h] [--name NAME] [--address ADDRESS]

optional arguments:
  -h, --help         show this help message and exit
  --name NAME        name of node to list
  --address ADDRESS  address of node to list
$
```

## Netconf

```
$ ./odl_test.py netconf --help
[INFO] <module>: This is initializing the automation log
usage: ./odl_test.py netconf [-h] [--name NAME]

optional arguments:
  -h, --help   show this help message and exit
  --name NAME  name of node to list
$
```

