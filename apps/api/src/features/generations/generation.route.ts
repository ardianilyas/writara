import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { generationController } from './generation.controller.js';

const router: Router = Router();

router.post('/', requireAuth, (req, res, next) => generationController.createGeneration(req, res, next));
router.get('/', requireAuth, (req, res, next) => generationController.getUserGenerations(req, res, next));
router.get('/:id', requireAuth, (req, res, next) => generationController.getGenerationById(req, res, next));
router.post('/:id/retry', requireAuth, (req, res, next) => generationController.retryGeneration(req, res, next));
router.delete('/:id', requireAuth, (req, res, next) => generationController.deleteGeneration(req, res, next));

export default router;
