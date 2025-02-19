# Setup Project

[Top](./README.md)

<br>

# Table of Contents
1. [Project Info](#ProjectInfo)
2. [Project Setup](#ProjectSetup)

<br>

# 1. Project Info <a name="ProjectInfo"></a>
- Type: NEST JS

<br>

# 2. Project Setup <a name="ProjectSetup"></a>

## 2.1. Create Dev Docker Image
```console
$ cd ${PROJECT_PATH}

$ # Build dev docker image
$ docker compose build dev
```

## 2.2. Setup Environment
> Use DEV Docker Image to setup the project
```console
$ cd ${PROJECT_PATH}
$ mkdir -p workspace

$ # Ensure permission access is resolved between host and docker environment
$ sudo chmod -R o+w . 

$ # Run dev docker container
$ docker compose run --rm dev bash

dev-docker$ ## Develop within docker container..
```

## 2.3. Create Project

### 2.3.1. Create Nest JS Project
```console
dev-docker$ cd ${PROJECT_PATH}/workspace
dev-docker$ nest new $PROJECT_NAME --directory .  # Select npm
dev-docker$ rm -rf .git # Delete git folder inside workspace
dev-docker$ chmod -R 777 * # Optional: Set permission
```


<br>

