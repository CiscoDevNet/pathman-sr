# Running Pathman_SR inside a docker container.

Updated 20160710

Here is a Dockerfile example for how to build a container that runs this app.

Uses CentOS 6.6

## Overview of Files

| Filename        | Purpose                            | Comments                   |
|-----------------|------------------------------------|----------------------------|
| Dockerfile      | The build recipe                   | Installs more than you need
| docker_build.sh | Builds the container               |
| docker_run.sh   | Starts the container and map ports | mapping

Supporting files in ./files:

| Filename        | Purpose                            | Comments                   |
|-----------------|------------------------------------|----------------------------|
| python_install.sh   | Centos 6.6 uses a very old Python version | 
| user_cisco.sh | Adds a user cisco          | Used for demo purposes
| backend.sh   | Starts the backend service |
| start_all.sh | Starts sshd and backend | You don't need sshd running

**Note:** Having either sshd running, or mapping /tmp:/tmp is useful for debugging.

## How To Build Container

```
./docker-build.sh
```


## How to Run the Container

```
./docker-run
```


## How to pull from Docker Hub
Pathman SR is avilable at <https://hub.docker.com/r/nikmon2/pathman_sr>

```
docker pull nikmon2/pathman_sr
```

### How to Run
```
docker run -d -p 8222:22 -p 8020:8020 -t nikmon2/pathman_sr
```
