import { Router } from 'express';
/* Controllers */
import SessionsController from './app/controllers/SessionsController';
import StudentsController from './app/controllers/StudentsController';
import PlansController from './app/controllers/PlansController';
/* Middleware */
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionsController.store);
/* a proteção de rotas valerá após o middleware global */
routes.use(authMiddleware);
routes.post('/students', StudentsController.store);
routes.put('/students/:id', StudentsController.update);
/* Plans */
routes.get('/plans', PlansController.index);
routes.post('/plans', PlansController.store);
routes.get('/plans/:id', PlansController.show);
routes.put('/plans/:id', PlansController.update);
routes.delete('/plans/:id', PlansController.destroy);

export default routes;
