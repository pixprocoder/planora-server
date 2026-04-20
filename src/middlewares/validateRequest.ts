import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import catchAsync from "../helpers/catchAsync";

const validateRequest = (schema: z.ZodTypeAny) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  });
};

export default validateRequest;
