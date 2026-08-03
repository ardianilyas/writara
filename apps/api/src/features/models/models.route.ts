import { Router } from 'express';
import { modelsController } from './models.controller.js';

const router: Router = Router();

router.get('/', (req, res, next) => modelsController.getModels(req, res, next));

export default router;
