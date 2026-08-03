import { Router } from 'express';
import { creditController } from './credit.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';

const router: Router = Router();

router.use(requireAuth);

router.get('/', (req, res, next) => creditController.getCredits(req, res, next));
router.post('/topup', (req, res, next) => creditController.topUp(req, res, next));

export default router;
