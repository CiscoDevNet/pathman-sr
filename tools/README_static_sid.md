# Static SIDs

## Overview
If You can't get get your router to reply to Netconf or BGP RIB requests from Pathman_SR, you can set a static SID with the app *set_static_sid.py*.

## Configuration
Configuration is shared with pathman_sr and is in pathman_ini.py
```
sid_saves = 'static_sids.json'
```

## set_static_sid.py cli

```
NMONTIN-M-21HT:bgp-rib nikmon$ ./set_static_sid.py --help
usage: ./set_static_sid.py [-h] [-v] {add,delete,list} ...

Add, List and Remove SIDs from pathman_sr static file: "static_sids.json"

positional arguments:
  {add,delete,list}  commands
    add              add a node to sid_list
    delete           delete a node from sid_list
    list             show sid_list

optional arguments:
  -h, --help         show this help message and exit
  -v, --version      show program's version number and exit

Copyright (c) 2015 by Cisco Systems, Inc. All Rights Reserved
$
```

## Add

```
$ ./set_static_sid.py add --help
usage: ./set_static_sid.py add [-h] --name NAME --address ADDRESS --sid SID

optional arguments:
  -h, --help         show this help message and exit
  --name NAME        name of node to add
  --address ADDRESS  loopback ip address
  --sid SID          node SID
$
```

## Delete

```
$ ./set_static_sid.py delete --help
usage: ./set_static_sid.py delete [-h] [--name NAME] [--address ADDRESS]
                                  [--sid SID]

optional arguments:
  -h, --help         show this help message and exit
  --name NAME        name of node to delete
  --address ADDRESS  loopback ip address of node to delete
  --sid SID          node SID of node to delete
$
```

## List

```
$ ./set_static_sid.py list --help
usage: ./set_static_sid.py list [-h] [--name NAME] [--address ADDRESS]
                                [--sid SID]

optional arguments:
  -h, --help         show this help message and exit
  --name NAME        name of node to list
  --address ADDRESS  loopback ip address of node to list
  --sid SID          node SID of node to list
$
```


## Example

```
./set_static_sid.py add --name alb --address 198.19.1.30 --sid 16030
adding: alb, success: True

./set_static_sid.py delete --sid 16025
./set_static_sid.py delete --name alb
```

