import { Router, type IRouter } from 'express';
import { PublicController } from '../controllers/public.controller.js';

export const publicRouter: IRouter = Router();

publicRouter.get('/initial', PublicController.getInitialData);
publicRouter.get('/courses/:id', PublicController.getCourseDetails);
