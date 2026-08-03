import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { toNodeHandler } from 'better-auth/node';
import { env } from './lib/env.js';
import { logger, httpLogger } from './lib/logger.js';
import { auth } from './lib/auth.js';
import { userRouter } from './features/users/index.js';
import { generationRouter, generationService } from './features/generations/index.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { sendSuccess } from './utils/response.js';
import { NotFoundError } from './errors/index.js';

const app: Express = express();

// Security and Logging Middleware
app.use(helmet());
app.use(httpLogger);

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

// Better Auth Handler (Placed before express.json parsing)
app.all('/api/auth/*', toNodeHandler(auth));

// Body Parsing Middleware
app.use(express.json());

// System Routes
app.get('/', (_req: Request, res: Response) => {
  sendSuccess(res, {
    message: 'Writara AI Content Generation API',
    status: 'online',
    version: '0.1.0',
  });
});

app.get('/health', (_req: Request, res: Response) => {
  sendSuccess(res, {
    status: 'ok',
    service: 'writara-api',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (_req: Request, res: Response) => {
  sendSuccess(res, {
    status: 'ok',
    service: 'writara-api',
    timestamp: new Date().toISOString(),
  });
});

// Feature Routes
app.use('/api/user', userRouter);
app.use('/api/generations', generationRouter);

// 404 Handler
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError('Route not found'));
});

// Global Error Middleware
app.use(errorMiddleware);

// Start Server & Cleanup Stale Jobs
app.listen(env.PORT, () => {
  logger.info(`⚡️ [server]: Express TS Server running at http://localhost:${env.PORT}`);

  // Auto-cleanup stale interrupted generations on startup
  generationService.cleanupStaleGenerations().catch((err: any) => {
    logger.error({ error: err.message }, 'Failed to run startup generation cleanup');
  });
});

export default app;
