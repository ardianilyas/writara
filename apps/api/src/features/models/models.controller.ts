import { Request, Response, NextFunction } from 'express';
import { modelsService } from './models.service.js';
import { sendSuccess } from '../../utils/response.js';

export class ModelsController {
  /**
   * GET /api/models
   * Returns list of available AI models for presentation generation.
   */
  async getModels(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const models = await modelsService.getActiveModels();
      sendSuccess(res, models);
    } catch (error) {
      next(error);
    }
  }
}

export const modelsController = new ModelsController();
