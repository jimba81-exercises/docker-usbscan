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

$ # Run dev docker container with ports mapped to the host
$ docker compose run --service-ports --rm dev bash 

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

### 2.3.2. Binding Server to 0.0.0.0
1. Update `workspace/package.json`
    ```json
    ...
    "scripts" {
      ...
      "start": "nest start --host 0.0.0.0",
      "start:dev": "nest start --host 0.0.0.0 --watch",
      ...
    }
    ```
2. Update `workspace/src/main.ts`
    ```ts
    async function bootstrap() {
      ...
      const port = process.env.PORT || 3000;
      console.log(`Listening on port ${port}`);
      await app.listen(port, '0.0.0.0');
    }
    ```

### 2.3.3. Install Swagger
- Ref: https://docs.nestjs.com/openapi/introduction
  ```console
  dev-docker$ cd workspace
  dev-docker$ npm install --save @nestjs/swagger swagger-ui-express
  dev-docker$ npm install class-validator class-transformer
  ```
- Update `main.ts` (Refer reference link)
- Install CLI plugin (this helps to maintain documentation without duplicate code). Ref: https://docs.nestjs.com/openapi/cli-plugin
  - Update nest-cli.json
    ```json
    {
        ...,
        "compilerOptions": {
          "plugins": [
            {
              "name": "@nestjs/swagger",
              "options": {
                "dtoFileNameSuffix": [".dto.ts", ".entyty.ts", ".def.ts"],
                "controllerFileNameSuffix": ".controller.ts"
              }
            }
          ]
        }
    }
    ```
- Check Swagger page (http://localhost:3000/api)


<br>

