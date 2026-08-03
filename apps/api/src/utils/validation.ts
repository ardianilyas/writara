import { z } from 'zod';
import { BadRequestError } from '../errors/http.errors.js';

export type ValidationSchema<T extends z.ZodTypeAny = z.ZodTypeAny> = T;

/**
 * Type-safe generic Zod validator utility function.
 * Validates request payload against a Zod schema and returns typed data.
 * Throws BadRequestError with structured field error array if validation fails.
 *
 * @param schema Zod schema (ZodTypeAny)
 * @param data Payload to validate (e.g. req.body)
 * @returns Type-inferred validated payload
 */
export function validate<T extends z.ZodTypeAny>(schema: T, data: unknown): z.infer<T> {
  const result = schema.safeParse(data);

  if (!result.success) {
    const formattedErrors = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    throw new BadRequestError('Validation failed', formattedErrors);
  }

  return result.data;
}
