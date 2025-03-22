import { Request, Response, NextFunction } from 'express';
import createError, { HttpError } from 'http-errors';
import logger from '../utils/logger';
import config from '../config';

/**
 * Middleware to handle 404 Not Found errors
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  next(createError(404, `Route not found: ${req.originalUrl}`));
};

/**
 * Middleware to handle all other errors
 */
export const errorHandler = (
  err: HttpError | Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  // Set status code and error message
  const statusCode = 'statusCode' in err ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';

  // Log the error
  if (statusCode >= 500) {
    logger.error(`${statusCode} - ${message}`, {
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      stack: 'stack' in err ? err.stack : undefined,
    });
  } else {
    logger.warn(`${statusCode} - ${message}`, {
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
    });
  }

  // Send response
  res.status(statusCode).json({
    error: {
      status: statusCode,
      message,
      ...(config.env === 'development' && 'stack' in err ? { stack: err.stack } : {}),
    },
  });
};
