import { Request, Response } from 'express';
import { sendSuccess } from '../../utils/response.js';

export class UserController {
  async getMe(req: Request, res: Response): Promise<void> {
    sendSuccess(res, {
      user: req.user ?? null,
      session: req.session ?? null,
    });
  }
}

export const userController = new UserController();
