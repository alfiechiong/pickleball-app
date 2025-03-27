import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import createError from 'http-errors';

export const validateRequest = (schema: Schema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      next(createError(400, errorMessage));
      return;
    }

    next();
  };
};
