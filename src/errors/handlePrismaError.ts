import * as PrismaModule from "@prisma/client";
const { Prisma } = PrismaModule;
import { TErrorSources, TGenericErrorResponse } from "../types/error";

const handlePrismaError = (err: PrismaModule.Prisma.PrismaClientKnownRequestError): TGenericErrorResponse => {

  let statusCode = 400;
  let message = "Prisma Error";
  let errorSources: TErrorSources = [
    {
      path: "",
      message: err.message,
    },
  ];

  if (err.code === "P2002") {
    // Unique constraint violation
    statusCode = 409;
    message = "Duplicate Entry";
    errorSources = [
      {
        path: (err.meta?.target as string[])?.join(", ") || "",
        message: "This value already exists",
      },
    ];
  } else if (err.code === "P2025") {
    // Record not found
    statusCode = 404;
    message = "Resource Not Found";
    errorSources = [
      {
        path: "",
        message: (err.meta?.cause as string) || "Record not found",
      },
    ];
  }

  return {
    statusCode,
    message,
    errorSources,
  };
};

export default handlePrismaError;
