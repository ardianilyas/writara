/**
 * Base custom application error class.
 * Extend this class for specific HTTP exceptions in services.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errors: any[];
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, errors: any[] = []) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
