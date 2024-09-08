<p align="center">
  <a href="https://www.openroboticmetaverse.org">
    <img alt="orom" src="https://raw.githubusercontent.com/openroboverse/knowledge-base/main/docs/assets/icon.png" width="100" />
  </a>
</p>
<h1 align="center">
  🤖 open robotic metaverse mvp - robotics platform 🌐
</h1>

> ### Migration WIP
>
> Undergoing migration to React from Vue

[![Netlify Status](https://api.netlify.com/api/v1/badges/a5a71d78-589b-47d6-85e7-8293bb8a7fdd/deploy-status)](https://app.netlify.com/sites/orom-mvp/deploys)

## Overview 🔍

This project serves as the MVP (Minimum Viable Product) 🚀 for a larger vision aimed at developing a robotic metaverse, that brings robotic projects in one place. Utilizing a combination of modern web technologies, this platform allows users to interact with robots through a web browser, fostering a unique and interactive environment.

![image](https://github.com/user-attachments/assets/b0002372-f65a-4d02-8b5a-93d587aae90f)



## Key Features 🗝️

- **Interactive Robotic Control**: Users can directly interact with robots in a virtual space. 🕹️
- **Real-Time Observation**: Enables witnessing interactions between other users and robots. 👀
- **Cross-User Engagement**: Supports multiple users interacting simultaneously within the metaverse. 👥

## Technology Stack 🛠️

- **Frontend**: Developed using Reac and Vite, offering a responsive and efficient user interface. 🌟
- **Backend**: WIP💪

## Setup ⚙️

1. Clone the Repo 📥

```bash
git clone https://github.com/openroboticmetaverse/mvp-webapp.git

```

```bash
cd mvp-webapp
```

2. Docker Compose 🐳

```bash
docker compose up -d
```

## Start the frontend 🖼️

(In a new terminal)

Open a console in the container 🖥️

```bash
docker exec -it mvp_frontend_react /bin/bash
```

In the container console:

```bash
yarn
```

```bash
yarn dev --host
```

Enjoy 🎉🥳
