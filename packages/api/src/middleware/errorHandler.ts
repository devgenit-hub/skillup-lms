import { type Request, type Response } from 'express';
import { AppError } from '../utils/errors.js';
import { ZodError } from 'zod';
import { Prisma } from '@repo/db';

interface ErrorResponse {
  status: 'error';
  statusCode: number;
  message: string;
  details?: unknown;
  stack?: string;
}

export const errorHandler = (err: Error, _req: Request, res: Response): void => {
  let error: ErrorResponse = {
    status: 'error',
    statusCode: 500,
    message: 'Internal server error',
  };

  // AppError (our custom errors)
  if (err instanceof AppError) {
    error = {
      status: 'error',
      statusCode: err.statusCode,
      message: err.message,
    };
  } else if (err instanceof ZodError) {
    const firstError = err.errors[0];
    error = {
      status: 'error',
      statusCode: 400,
      message: firstError?.message || 'Validation failed',
    };
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    error = handlePrismaError(err);
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    error = {
      status: 'error',
      statusCode: 400,
      message: 'Invalid data provided',
    };
  } else {
    error = {
      status: 'error',
      statusCode: 500,
      message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    };
  }

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    error.stack = err.stack;
  }

  // Log error
  console.error('Error:', {
    name: err.name,
    message: err.message,
    statusCode: error.statusCode,
    stack: err.stack,
  });

  res.status(error.statusCode).json(error);
};

// Handle Prisma-specific errors
function handlePrismaError(err: Prisma.PrismaClientKnownRequestError): ErrorResponse {
  switch (err.code) {
    case 'P2002':
      // Unique constraint violation
      return {
        status: 'error',
        statusCode: 409,
        message: 'A record with this value already exists',
        details: { field: err.meta?.target },
      };
    case 'P2025':
      // Record not found
      return {
        status: 'error',
        statusCode: 404,
        message: 'Record not found',
      };
    case 'P2003':
      // Foreign key constraint violation
      return {
        status: 'error',
        statusCode: 400,
        message: 'Invalid reference to related record',
      };
    case 'P2014':
      // Invalid relation
      return {
        status: 'error',
        statusCode: 400,
        message: 'Invalid relation in query',
      };
    default:
      return {
        status: 'error',
        statusCode: 500,
        message: 'Database operation failed',
      };
  }
}

// 404 handler for undefined routes
export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({
    status: 'error',
    statusCode: 404,
    message: 'Route not found',
  });
};
