/* Libs */
import 'dotenv/config';
import express from 'express';
import * as Sentry from '@sentry/node';
import Youch from 'youch';
/* Config */
import sentryConfig from './config/sentry';
/* Catch Errors */
import 'express-async-errors';
/* Route */
import routes from './routes';
/* Database */
import './database';

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }

  exceptionHandler() {
    this.server.use(async (error, request, response, next) => {
      if (process.env.NODE_ENV === 'development') {
        const erros = await new Youch(error, request).toJSON();

        return response.status(500).json(erros);
      }

      return response.status(500).json({ error: 'Internal server error' });
    });
  }
}

export default new App().server;
