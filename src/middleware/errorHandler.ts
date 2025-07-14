import { Request, Response, NextFunction } from "express";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal Server Error";
  let code = error.code || "INTERNAL_ERROR";

  // Handle Prisma errors
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        statusCode = 409;
        message = "A record with this data already exists";
        code = "DUPLICATE_ENTRY";
        break;
      case "P2025":
        statusCode = 404;
        message = "Record not found";
        code = "RECORD_NOT_FOUND";
        break;
      case "P2003":
        statusCode = 400;
        message = "Foreign key constraint failed";
        code = "FOREIGN_KEY_CONSTRAINT";
        break;
      default:
        statusCode = 400;
        message = "Database operation failed";
        code = "DATABASE_ERROR";
    }
  }

  // Handle Prisma validation errors
  if (error instanceof PrismaClientValidationError) {
    statusCode = 400;
    message = "Invalid data provided";
    code = "VALIDATION_ERROR";
  }

  // Log error in development
  if (process.env.NODE_ENV === "development") {
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
      statusCode,
    });
  }

  res.status(statusCode).json({
    error: message,
    code,
    ...(process.env.NODE_ENV === "development" && {
      stack: error.stack,
      details: error,
    }),
  });
};
