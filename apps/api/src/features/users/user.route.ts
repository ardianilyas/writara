import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { userController } from './user.controller.js';

const router: Router = Router();

router.get('/me', requireAuth, (req, res) => userController.getMe(req, res));

export default router;
