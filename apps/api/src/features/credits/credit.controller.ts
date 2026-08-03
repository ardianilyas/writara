import { Request, Response, NextFunction } from 'express';
import { creditService } from './credit.service.js';

export class CreditController {
  /**
   * GET /api/credits
   * Retrieves credit balances for the authenticated user.
   */
  async getCredits(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const credits = await creditService.getUserCredits(userId);
      res.json({ success: true, data: credits });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/credits/topup
   * Mock top-up endpoint for purchasing lifetime credits.
   */
  async topUp(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const amount = Number(req.body.amount) || 10;
      const user = await creditService.addPurchasedCredits(userId, amount, `Purchased ${amount} credits`);
      res.json({ success: true, message: `Successfully added ${amount} credits`, data: { purchasedCredits: user.purchasedCredits } });
    } catch (error) {
      next(error);
    }
  }
}

export const creditController = new CreditController();
