# Yggdrasil Frontend

## What is Yggdrasil?
Yggdrasil is a content carousel display system, used for displaying carousels of pictures, videos, twitter feeds, and elements of the other systems within the Asgard System Stack.

This repository is for the frontend web app used to consume and interact with the Yggdrasil API.

<br>

---

## Overview
The Yggdrasil frontend has been developed using our template for Webpack-Vue projects.

### Features
- Webpack Compilation
- Babel transpiling
- Javascript and Typescript support
- Sass, Scss and Css support
- Vue component file (.vue) support
- Live development via Hot module reloading
- Local and Docker deployment
- NPM and yarn support (yarn by default)

### Dependencies
- Node.js
- Yarn package manager (Default - npm alternatively is supported)
- Docker (optional - for Docker deployment)
- Bash (optional - for scripted Docker deployment)


<br>

---

## Yarn Run Commands
Local use with Yarn package manager.


### Development - "run dev'
Accessible on Localhost:8080.

```bash
cd app
yarn
yarn run dev
```

### Build - "run build"
Compiles the project source ready for deployment, exports to app/dist.

```bash
cd app
yarn
yarn run build
```

<br>

---

## NPM Run Commands
Local use with Node package manager.

Please Note - This repository has been configured using Yarn and therefore does not contain a lock-file for NPM.

### Development - "run dev'
Accessible on Localhost:8080.

```bash
cd app
npm install .
npm run dev
```

### Build - "run build"
Compiles the project source ready for deployment, exports to app/dist.

```bash
cd app
npm install .
npm run build
```

<br>

---

## Docker Deployment
Deploys to Docker via Docker-compose

### Development
#### Scripted Deployment
```bash
sudo chmod +x deployment/dev.sh
./deployment/dev.sh
```

#### Manual Deployment
```bash
docker-compose -p yggdrasil-frontend-dev -f docker-compose.dev.yml up -d --build --remove-orphans
```
### Production
#### Scripted Deployment
```bash
sudo chmod +x deployment/prod.sh
./deployment/prod.sh
```

#### Manual Deployment
```bash
docker-compose -p yggdrasil-frontend -f docker-compose.yml up -d --build --remove-orphans
```
