import { Request, Response } from "express";
import catchAsync from "../../helpers/catchAsync";
import sendResponse from "../../helpers/sendResponseHelper";
import { joinRequestService } from "./joinRequest.service";

const createJoinRequest = catchAsync(async (req: Request, res: Response) => {
  const { eventId } = req.body;
  const user = req.user!;
  const result = await joinRequestService.createJoinRequestIntoDB(eventId, user.id);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Join request sent successfully",
    data: result,
  });
});

const updateJoinRequestStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const user = req.user!;
  
  const result = await joinRequestService.updateJoinRequestStatusInDB(
    id as string,
    status,
    user.id,
    user.role
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Request ${status.toLowerCase()} successfully`,
    data: result,
  });
});

const getMyRequests = catchAsync(async (req: Request, res: Response) => {
  const user = req.user!;
  const result = await joinRequestService.getMyRequestsFromDB(user.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your join requests retrieved successfully",
    data: result,
  });
});

const getEventRequests = catchAsync(async (req: Request, res: Response) => {
  const { eventId } = req.params;
  const user = req.user!;
  
  const result = await joinRequestService.getEventRequestsFromDB(
    eventId as string,
    user.id,
    user.role
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Event join requests retrieved successfully",
    data: result,
  });
});

const getOrganizerRequests = catchAsync(async (req: Request, res: Response) => {
  const user = req.user!;
  const result = await joinRequestService.getOrganizerRequestsFromDB(user.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Organizer join requests retrieved successfully",
    data: result,
  });
});

export const joinRequestController = {
  createJoinRequest,
  updateJoinRequestStatus,
  getMyRequests,
  getEventRequests,
  getOrganizerRequests,
};
