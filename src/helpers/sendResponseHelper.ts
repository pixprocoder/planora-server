import { Response } from "express";
import { IApiResponse } from "../types/apiResponse";

const sendResponse = <T>(res: Response, data: IApiResponse<T>): void => {
  const responseData: IApiResponse<T> = {
    statusCode: data.statusCode,
    success: data.success,
    message: data.message || (data.success ? "Success" : "Error"),
    ...(data.meta && { meta: data.meta }),
    ...(data.data !== undefined && { data: data.data }),
  };

  res.status(data.statusCode).json(responseData);
};

export default sendResponse;
