import {Request, Response, NextFunction} from 'express';

export interface CustomError extends Error {
  statusCode?: number;
}

export const errorHandler = (error: CustomError, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', error);

  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal server error';

  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
  }

  if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  if (error.name === 'MongoServerError' && (error as any).code === 11000) {
    statusCode = 409;
    message = 'Resource already exists';
  }

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && {stack: error.stack}),
  });
};
