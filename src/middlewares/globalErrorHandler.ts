import { Prisma } from "@prisma/client";



import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import config from "../config/index";
import AppError from "../errors/AppError";
import handlePrismaError from "../errors/handlePrismaError";
import handleZodError from "../errors/handleZodError";
import { TErrorSources } from "../types/error";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // Default values
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorSources: TErrorSources = [
    {
      path: "",
      message: "An unexpected error occurred",
    },
  ];

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const simplifiedError = handlePrismaError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err?.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err?.message,
      },
    ];
  }

  // Final Response
  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.env === "development" ? err?.stack : null,
  });
};

export default globalErrorHandler;
