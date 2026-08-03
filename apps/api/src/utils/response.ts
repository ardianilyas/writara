import { Response } from 'express';

export interface ApiSuccessResponse<T = any> {
  success: true;
  message?: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors: any[];
}

/**
 * Sends a standardized success API response adhering to AGENTS.md formatting rules.
 *
 * @param res Express Response object
 * @param data Data payload to return
 * @param statusCode HTTP status code (default: 200)
 * @param message Optional success message
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode: number = 200,
  message?: string
): Response {
  const payload: ApiSuccessResponse<T> = {
    success: true,
    ...(message ? { message } : {}),
    data,
  };
  return res.status(statusCode).json(payload);
}

/**
 * Sends a standardized error API response adhering to AGENTS.md formatting rules.
 *
 * @param res Express Response object
 * @param message Error message description
 * @param statusCode HTTP status code (default: 400)
 * @param errors Additional error details or stack array
 */
export function sendError(
  res: Response,
  message: string = 'An error occurred',
  statusCode: number = 400,
  errors: any[] = []
): Response {
  const payload: ApiErrorResponse = {
    success: false,
    message,
    errors,
  };
  return res.status(statusCode).json(payload);
}
