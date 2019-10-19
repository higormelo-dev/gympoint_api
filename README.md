<h1 align="center">
<br>
  <img src="logo.svg" alt="GoBarber" width="90">
<br>
<br>
GymPoint API
</h1>

<p align="center">An API for gym manager.</p>

<p align="center">
  <a href="http://makeapullrequest.com">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome">
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="License MIT">
  </a>
</p>

<hr />

## Features

A Node.js API built with Express and all the latest tools and best practices in development!

- ⚡ **Express** — A web framework for Node
- 💾 **Sequelize** — SQL dialect ORM for Node.js (Use it PostgreSQL or MySQL)
- 🍂 **MongoDB** — document-based database
- 🔑 **Redis** — key-value data model
- ⌨️ **Yup** - Object schema validation
- 🔺 **Sentry** - cross-platform application monitoring
- 📧 **Nodemailer** - Send e-mails with Node.JS
- 💖 **Lint** — ESlint/Prettier/Editor Config
- **Sucrase**
- **Nodemon**


## Dependencies

- [Node.js](https://nodejs.org/en/) 10.16.3
- [Yarn](https://yarnpkg.com/pt-BR/docs/install) 1.19.1
- [Docker](https://www.docker.com/)
- [Sequelize](https://sequelize.org/)

## Prerequisites

_In the next few weeks, I plan to include Docker directly in the repository with docker-compose, until there this step is required._

To run this server you will need three containers running on your machine.

_Remember: If you restart your machine, you will need to start again the server with `docker start <container_id>`._

## Getting started

_Consider checking out the FrontEnd [repository](https://github.com/higormeloap89/gobarber-api)!_

1. Clone this repo using `https://github.com/higormeloap89/gympoint_api.git`
2. Move to the appropriate directory: `cd gympoint_api`.<br />
3. Run `yarn` to install dependencies.<br />
4. Add all the values for the environment variables.<br/>
5. Run `yarn start` and `yarn queue` to run the servers at `http://localhost:3333`.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
