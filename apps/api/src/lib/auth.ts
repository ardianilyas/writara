import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './prisma.js';
import { env } from './env.js';

import { CreditTransactionType } from '../generated/client/index.js';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [env.CLIENT_URL, env.BETTER_AUTH_URL],
  advanced: {
    disableCSRFCheck: env.NODE_ENV === 'development',
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            await prisma.user.update({
              where: { id: user.id },
              data: { freeCredits: 3 },
            });

            await prisma.creditTransaction.create({
              data: {
                userId: user.id,
                amount: 3,
                poolType: 'FREE',
                type: CreditTransactionType.WELCOME_BONUS,
                description: 'Welcome bonus 3 free trial credits upon registration',
              },
            });
          } catch (err) {
            console.error('Failed to award welcome credits to user:', err);
          }
        },
      },
    },
  },
});
