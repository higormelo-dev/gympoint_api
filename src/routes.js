import { Router } from 'express';
/* Controllers */
import SessionsController from './app/controllers/SessionsController';
import StudentsController from './app/controllers/StudentsController';
import PlansController from './app/controllers/PlansController';
import EnrollmentsController from './app/controllers/EnrollmentsController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrdersController from './app/controllers/HelpOrdersController';
import AvailablesController from './app/controllers/AvailablesController';
import AnswersController from './app/controllers/AnswersController';
/* Middleware */
import authMiddleware from './app/middlewares/auth';

const routes = new Router();
/* Sessions */
routes.post('/sessions', SessionsController.store);
/* Checkins */
routes.get('/students/:student_id/checkins', CheckinController.index);
routes.post('/students/:student_id/checkins', CheckinController.store);
/* Help orders */
routes.get('/students/:student_id/help-orders', HelpOrdersController.index);
routes.post('/students/:student_id/help-orders', HelpOrdersController.store);
/* Route protection. Will be worth after global middleware */
routes.use(authMiddleware);
/* Students */
routes.get('/students', StudentsController.index);
routes.post('/students', StudentsController.store);
routes.get('/students/:id', StudentsController.show);
routes.put('/students/:id', StudentsController.update);
/* Plans */
routes.get('/plans', PlansController.index);
routes.post('/plans', PlansController.store);
routes.get('/plans/:id', PlansController.show);
routes.put('/plans/:id', PlansController.update);
routes.delete('/plans/:id', PlansController.destroy);
/* Enrollments */
routes.get('/enrollments', EnrollmentsController.index);
routes.post('/enrollments', EnrollmentsController.store);
routes.get('/enrollments/:id', EnrollmentsController.show);
routes.put('/enrollments/:id', EnrollmentsController.update);
routes.delete('/enrollments/:id', EnrollmentsController.destroy);
/* Help orders (Gym) */
routes.get('/students/help-orders/available', AvailablesController.index);
routes.post('/help-orders/:help_id/answer', AnswersController.store);

export default routes;
