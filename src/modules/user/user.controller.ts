import { Request, Response } from "express";
import catchAsync from "../../helpers/catchAsync";
import sendResponse from "../../helpers/sendResponseHelper";
import { userService } from "./user.service";

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user!;
  const result = await userService.getMyProfileFromDB(user.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User profile retrieved successfully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.getAllUsersFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user!;
  const result = await userService.updateProfileInDB(user.id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await userService.updateUserStatusInDB(id as string, status);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User status updated successfully",
    data: result,
  });
});

export const userController = {
  getMyProfile,
  getAllUsers,
  updateProfile,
  updateUserStatus,
};

