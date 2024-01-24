
<p align="center">
  <a href="https://www.openroboticmetaverse.org">
    <img alt="orom" src="https://raw.githubusercontent.com/openroboverse/knowledge-base/main/docs/assets/icon.png" width="100" />
  </a>
</p>
<h1 align="center">
  🤖 Open Robotic Metaverse MVP - Robotics Platform 🌐
</h1>

Yet another Vue 3 app ... 👾

## Setup ⚙️

1. Clone the Repo 📥

```bash
git clone https://github.com/openroboticmetaverse/mvp-webapp.git

```

2. Docker Compose 🐳

```bash
docker compose up -d
```

## Start the backend server 💻

Open a console in the container 🖥️
```bash
docker exec -it mvp_backend /bin/bash
```

In the container console:
```bash
npm i
```
```bash
npm run start
```
## Start the frontend 🖼️

Open a console in the container 🖥️
```bash
docker exec -it mvp_frontend /bin/bash
```
In the container console:
```bash
npm i
```
```bash
npm run dev
```


Enjoy 🎉🥳
