import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../utils/response.js';
import { validate } from '../../utils/validation.js';
import { createGenerationSchema } from './generation.validation.js';
import { generationService } from './generation.service.js';

export class GenerationController {
  async createGeneration(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = validate(createGenerationSchema, req.body);
      const userId = req.user!.id;

      const generation = await generationService.createGeneration(userId, data);
      sendSuccess(res, generation, 201, 'Generation queued. Poll GET /api/generations/:id for status.');
    } catch (error) {
      next(error);
    }
  }

  async getGenerationById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const generation = await generationService.getGenerationById(id as string, userId);
      sendSuccess(res, generation);
    } catch (error) {
      next(error);
    }
  }

  async getUserGenerations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const generations = await generationService.getUserGenerations(userId);
      sendSuccess(res, generations);
    } catch (error) {
      next(error);
    }
  }

  async retryGeneration(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const generation = await generationService.retryGeneration(id as string, userId);
      sendSuccess(res, generation, 200, 'Generation retry queued.');
    } catch (error) {
      next(error);
    }
  }

  async deleteGeneration(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      await generationService.deleteGeneration(id as string, userId);
      sendSuccess(res, { id }, 200, 'Generation record deleted successfully.');
    } catch (error) {
      next(error);
    }
  }
}

export const generationController = new GenerationController();
