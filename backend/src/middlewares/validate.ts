import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import createError from 'http-errors';

/**
 * Middleware to check express-validator validation results
 * If there are validation errors, it returns a 400 response with the error details
 */
export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map(error => error.msg)
      .join(', ');
    const validationError = createError(400, `Validation error: ${message}`);
    next(validationError);
    return;
  }

  next();
};
