import { Request, Response } from 'express';
import { ApiResponse, PaginationParams } from '../types';

export abstract class BaseController {
  protected sendSuccess<T>(
    res: Response,
    data?: T,
    message?: string,
    statusCode: number = 200
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      data,
      message,
    };
    return res.status(statusCode).json(response);
  }

  protected sendError(
    res: Response,
    error: string,
    statusCode: number = 400
  ): Response {
    const response: ApiResponse<null> = {
      success: false,
      error,
    };
    return res.status(statusCode).json(response);
  }

  protected extractPaginationParams(req: Request): PaginationParams {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100); // Max 100 per page
    
    return { page, limit };
  }

  protected extractSearchParams(req: Request): { search?: string; page: number; limit: number } {
    const pagination = this.extractPaginationParams(req);
    const search = req.query.search as string || undefined;
    
    return { ...pagination, search };
  }

  protected handleServiceError(res: Response, error: unknown): Response {
    console.error('Service Error:', error);
    
    if (error instanceof Error) {
      return this.sendError(res, error.message);
    }
    
    return this.sendError(res, 'Une erreur interne est survenue', 500);
  }

  protected validateId(id: string): boolean {
    // Validation basique pour les IDs Prisma CUID
    return typeof id === 'string' && id.length > 0;
  }

  protected sendNotFound(res: Response, resource: string = 'Ressource'): Response {
    return this.sendError(res, `${resource} non trouvée`, 404);
  }

  protected sendValidationError(res: Response, message: string): Response {
    return this.sendError(res, message, 422);
  }
} 