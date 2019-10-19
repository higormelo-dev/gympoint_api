import { Router } from 'express';
/* Controllers */
import SessionsController from './app/controllers/SessionsController';
import StudentsController from './app/controllers/StudentsController';
/* Middleware */
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionsController.store);
/* a proteção de rotas valerá após o middleware global */
routes.use(authMiddleware);
routes.post('/students', StudentsController.store);
routes.put('/students/:id', StudentsController.update);

export default routes;
