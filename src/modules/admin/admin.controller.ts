import { Request, Response } from "express";
import catchAsync from "../../helpers/catchAsync";
import sendResponse from "../../helpers/sendResponseHelper";
import { adminService } from "./admin.service";

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getDashboardStatsFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin dashboard statistics retrieved successfully",
    data: result,
  });
});

export const adminController = {
  getDashboardStats,
};
