import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  console.error('Error Details:', {
    name: error.name,
    message: error.message,
    stack: error.stack,
    statusCode: error.statusCode,
    url: req.url,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
  });

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Une erreur interne est survenue';

  const response: ApiResponse<null> = {
    success: false,
    error: message,
  };

  return res.status(statusCode).json(response);
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  const response: ApiResponse<null> = {
    success: false,
    error: `Route ${req.originalUrl} non trouvée`,
  };

  return res.status(404).json(response);
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}; 