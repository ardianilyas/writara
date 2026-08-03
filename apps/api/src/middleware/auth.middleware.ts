import { Request, Response, NextFunction } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../lib/auth.js';
import { UnauthorizedError } from '../errors/http.errors.js';

declare global {
  namespace Express {
    interface Request {
      user?: typeof auth.$Infer.Session.user | null;
      session?: typeof auth.$Infer.Session.session | null;
    }
  }
}

/**
 * Authentication middleware enforcing active Better Auth session.
 * Throws UnauthorizedError if unauthenticated.
 */
export async function requireAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const sessionData = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!sessionData || !sessionData.user) {
      throw new UnauthorizedError(
        'Unauthorized. Authentication is required to access this resource.',
        ['AUTHENTICATION_REQUIRED']
      );
    }

    req.user = sessionData.user;
    req.session = sessionData.session;
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Optional authentication middleware.
 * Attaches user and session if valid headers are present without blocking unauthenticated requests.
 */
export async function optionalAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const sessionData = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (sessionData) {
      req.user = sessionData.user;
      req.session = sessionData.session;
    }
    next();
  } catch (error) {
    next(error);
  }
}
