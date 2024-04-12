# TutoringServiceFrontendVueJS

Backend часть написана на FastAPI, найти можно [тут (link)](https://github.com/raison-collab/TutorialServiceFastAPI)

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

##  Environment

You need `.env.development` and `.env.production` at the root of the project. There you need to specify the data to connect to the server

### env example

```
VITE_SERVER_HOST=127.0.0.1
VITE_SERVER_PORT=8000
VITE_SERVER_PROTOCOL=http
```
