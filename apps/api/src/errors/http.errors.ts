import { AppError } from './app.error.js';

/**
 * 400 Bad Request Error
 */
export class BadRequestError extends AppError {
  constructor(message: string = 'Bad request', errors: any[] = []) {
    super(message, 400, errors);
  }
}

/**
 * 401 Unauthorized Error
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized access', errors: any[] = []) {
    super(message, 401, errors);
  }
}

/**
 * 403 Forbidden Error
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Access forbidden', errors: any[] = []) {
    super(message, 403, errors);
  }
}

/**
 * 404 Not Found Error
 */
export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found', errors: any[] = []) {
    super(message, 404, errors);
  }
}

/**
 * 409 Conflict Error
 */
export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict', errors: any[] = []) {
    super(message, 409, errors);
  }
}

/**
 * 422 Validation Error
 */
export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed', errors: any[] = []) {
    super(message, 422, errors);
  }
}

/**
 * 500 Internal Server Error
 */
export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error', errors: any[] = []) {
    super(message, 500, errors);
  }
}
