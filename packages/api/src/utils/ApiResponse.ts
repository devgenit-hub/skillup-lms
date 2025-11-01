import { type Response } from 'express';

interface SuccessResponse<T> {
  status: 'success';
  data: T;
  message?: string;
}

interface PaginatedResponse<T> {
  status: 'success';
  data: T;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class ApiResponse {
  static success<T>(res: Response, data: T, message?: string, statusCode: number = 200): void {
    const response: SuccessResponse<T> = {
      status: 'success',
      data,
    };
    if (message) response.message = message;
    res.status(statusCode).json(response);
  }

  static created<T>(res: Response, data: T, message?: string): void {
    this.success(res, data, message, 201);
  }

  static paginated<T>(
    res: Response,
    data: T,
    pagination: { page: number; limit: number; total: number }
  ): void {
    const response: PaginatedResponse<T> = {
      status: 'success',
      data,
      pagination: {
        ...pagination,
        totalPages: Math.ceil(pagination.total / pagination.limit),
      },
    };
    res.status(200).json(response);
  }

  static noContent(res: Response): void {
    res.status(204).send();
  }
}
