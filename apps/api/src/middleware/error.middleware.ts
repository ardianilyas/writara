import { Request, Response, NextFunction } from 'express';
import { Prisma } from '../generated/client/index.js';
import { logger } from '../lib/logger.js';
import { AppError } from '../errors/app.error.js';
import { sendError } from '../utils/response.js';

/**
 * Global error middleware handling AppError instances, Prisma ORM exceptions,
 * and uncaught server errors.
 */
export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error(err, 'Error caught in global error middleware');

  // Handle Custom Application Errors (NotFoundError, BadRequestError, UnauthorizedError, etc.)
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode, err.errors);
    return;
  }

  // Handle Prisma Known Request Errors (e.g. P2002 unique constraint, P2025 not found)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002': {
        const target = err.meta?.target;
        const fields = Array.isArray(target) ? target.join(', ') : target ? String(target) : '';
        const message = fields
          ? `A record with this ${fields} already exists.`
          : 'A record with this unique value already exists.';
        sendError(res, message, 409, [
          {
            code: 'DUPLICATE_ENTRY',
            field: fields,
            meta: err.meta,
          },
        ]);
        return;
      }
      case 'P2025': {
        const cause = (err.meta?.cause as string) || 'Requested record was not found.';
        sendError(res, cause, 404, [
          {
            code: 'RECORD_NOT_FOUND',
            meta: err.meta,
          },
        ]);
        return;
      }
      case 'P2003': {
        const fieldName = (err.meta?.field_name as string) || 'foreign key';
        sendError(res, `Foreign key constraint failed on ${fieldName}.`, 400, [
          {
            code: 'FOREIGN_KEY_CONSTRAINT_FAILED',
            meta: err.meta,
          },
        ]);
        return;
      }
      case 'P2014': {
        sendError(res, 'The requested change violates a required relation between models.', 400, [
          {
            code: 'REQUIRED_RELATION_VIOLATION',
            meta: err.meta,
          },
        ]);
        return;
      }
      default: {
        sendError(res, 'Database operation failed.', 400, [
          {
            code: err.code,
            meta: err.meta,
          },
        ]);
        return;
      }
    }
  }

  // Handle Prisma Query Validation Errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    sendError(res, 'Invalid data format or query structure provided to database.', 400, [
      {
        code: 'PRISMA_VALIDATION_ERROR',
      },
    ]);
    return;
  }

  // Handle Prisma Database Connection Errors
  if (err instanceof Prisma.PrismaClientInitializationError) {
    sendError(res, 'Database connection failed. Please ensure database server is running.', 503, [
      {
        code: 'DATABASE_CONNECTION_ERROR',
        errorCode: err.errorCode,
      },
    ]);
    return;
  }

  // Fallback for General Uncaught Errors
  const statusCode = (err as any).statusCode || (err as any).status || 500;
  sendError(res, err.message || 'Internal server error', statusCode);
}
