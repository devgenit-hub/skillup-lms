import { Router, type IRouter } from 'express';
import { CategoryController } from '../controllers/category.controller.js';

export const categoryRouter: IRouter = Router();

categoryRouter.get('/', CategoryController.getCategories);
categoryRouter.post('/', CategoryController.createCategory);
