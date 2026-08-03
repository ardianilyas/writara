import { CreditTransactionType } from '../../generated/client/index.js';
import { prisma } from '../../lib/prisma.js';
import { BadRequestError, NotFoundError } from '../../errors/index.js';
import { logger } from '../../lib/logger.js';

export interface DeductCreditResult {
  freeDeducted: number;
  purchasedDeducted: number;
}

export class CreditService {
  /**
   * Retrieves the current credit balances for a user.
   */
  async getUserCredits(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        freeCredits: true,
        purchasedCredits: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found.');
    }

    const totalCredits = user.freeCredits + user.purchasedCredits;
    return {
      freeCredits: user.freeCredits,
      purchasedCredits: user.purchasedCredits,
      totalCredits,
    };
  }

  /**
   * Deducts credits from user balance, consuming free credits first, then purchased.
   * Runs inside a Prisma transaction for concurrency safety.
   */
  async deductCredits(userId: string, amount: number, description: string): Promise<DeductCreditResult> {
    if (amount <= 0) return { freeDeducted: 0, purchasedDeducted: 0 };

    return prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { freeCredits: true, purchasedCredits: true },
      });

      if (!user) {
        throw new NotFoundError('User not found.');
      }

      const totalAvailable = user.freeCredits + user.purchasedCredits;
      if (totalAvailable < amount) {
        throw new BadRequestError(
          `Insufficient credits. Required: ${amount}, Available: ${totalAvailable}. Please top up your credits.`
        );
      }

      let freeDeducted = 0;
      let purchasedDeducted = 0;

      if (user.freeCredits >= amount) {
        freeDeducted = amount;
      } else {
        freeDeducted = user.freeCredits;
        purchasedDeducted = amount - freeDeducted;
      }

      const newFree = user.freeCredits - freeDeducted;
      const newPurchased = user.purchasedCredits - purchasedDeducted;

      await tx.user.update({
        where: { id: userId },
        data: {
          freeCredits: newFree,
          purchasedCredits: newPurchased,
        },
      });

      if (freeDeducted > 0) {
        await tx.creditTransaction.create({
          data: {
            userId,
            amount: -freeDeducted,
            poolType: 'FREE',
            type: CreditTransactionType.GENERATION_DEDUCT,
            description,
          },
        });
      }

      if (purchasedDeducted > 0) {
        await tx.creditTransaction.create({
          data: {
            userId,
            amount: -purchasedDeducted,
            poolType: 'PURCHASED',
            type: CreditTransactionType.GENERATION_DEDUCT,
            description,
          },
        });
      }

      logger.info(
        { userId, amount, freeDeducted, purchasedDeducted, newFree, newPurchased },
        'Credits deducted successfully'
      );

      return { freeDeducted, purchasedDeducted };
    });
  }

  /**
   * Automatically restores deducted credits to a user if generation fails.
   */
  async refundCredits(
    userId: string,
    freeAmount: number,
    purchasedAmount: number,
    description: string
  ): Promise<void> {
    if (freeAmount <= 0 && purchasedAmount <= 0) return;

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          freeCredits: { increment: freeAmount },
          purchasedCredits: { increment: purchasedAmount },
        },
      });

      if (freeAmount > 0) {
        await tx.creditTransaction.create({
          data: {
            userId,
            amount: freeAmount,
            poolType: 'FREE',
            type: CreditTransactionType.GENERATION_REFUND,
            description,
          },
        });
      }

      if (purchasedAmount > 0) {
        await tx.creditTransaction.create({
          data: {
            userId,
            amount: purchasedAmount,
            poolType: 'PURCHASED',
            type: CreditTransactionType.GENERATION_REFUND,
            description,
          },
        });
      }
    });

    logger.info({ userId, freeAmount, purchasedAmount, description }, 'Credits refunded due to generation failure');
  }

  /**
   * Top-up lifetime purchased credits for a user.
   */
  async addPurchasedCredits(userId: string, amount: number, description: string) {
    if (amount <= 0) throw new BadRequestError('Top-up amount must be positive.');

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        purchasedCredits: { increment: amount },
      },
    });

    await prisma.creditTransaction.create({
      data: {
        userId,
        amount,
        poolType: 'PURCHASED',
        type: CreditTransactionType.TOP_UP,
        description,
      },
    });

    logger.info({ userId, amount, newTotal: updatedUser.purchasedCredits }, 'Purchased credits added');
    return updatedUser;
  }
}

export const creditService = new CreditService();
