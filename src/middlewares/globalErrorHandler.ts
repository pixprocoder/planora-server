import { NextFunction, Request, Response } from "express";
import config from "../config/index";

interface CustomError extends Error {
  status?: number;
  statusCode?: number;
  code?: string;
  errors?: any;
}

const globalErrorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default error values
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || "Internal Server Error";

  // Handle specific error types
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Error";
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  if (err.code === "P2002") {
    // Prisma unique constraint error
    statusCode = 409;
    message = "Resource already exists";
  }

  if (err.code === "P2025") {
    // Prisma record not found
    statusCode = 404;
    message = "Resource not found";
  }

  // Log error for debugging
  if (config.env === "development") {
    console.error("Error Details:", {
      name: err.name,
      message: err.message,
      stack: err.stack,
      code: err.code,
    });
  } else {
    console.error("Error:", err.message);
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    ...(config.env === "development" && {
      error: {
        name: err.name,
        stack: err.stack,
        code: err.code,
        details: err.errors,
      },
    }),
  });
};

export default globalErrorHandler;
