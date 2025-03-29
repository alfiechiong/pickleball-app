import { Request, Response, NextFunction } from 'express';
import { HttpError } from 'http-errors';
import logger from '../utils/logger';

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  logger.error(`Not Found - ${req.method} ${req.originalUrl}`, {
    method: req.method,
    path: req.originalUrl,
  });
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err: HttpError, _req: Request, res: Response, _next: NextFunction) => {
  logger.error('Error:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    statusCode: err.status || 500,
    timestamp: new Date().toISOString(),
  });

  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
