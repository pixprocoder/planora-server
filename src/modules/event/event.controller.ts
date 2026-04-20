import { Request, Response } from "express";
import catchAsync from "../../helpers/catchAsync";
import sendResponse from "../../helpers/sendResponseHelper";
import { eventService } from "./event.service";

const createEvent = catchAsync(async (req: Request, res: Response) => {
  const user = req.user!;
  const result = await eventService.createEventIntoDB(req.body, user.id);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Event created successfully",
    data: result,
  });
});

const getAllEvents = catchAsync(async (req: Request, res: Response) => {
  const result = await eventService.getAllEventsFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Events retrieved successfully",
    data: result,
  });
});

const getMyEvents = catchAsync(async (req: Request, res: Response) => {
  const user = req.user!;
  const result = await eventService.getMyEventsFromDB(user.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Events retrieved successfully",
    data: result,
  });
});

const getSingleEvent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await eventService.getSingleEventFromDB(id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Event retrieved successfully",
    data: result,
  });
});

const updateEvent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user!;
  const result = await eventService.updateEventInDB(
    id as string,
    user.id,
    user.role,
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Event updated successfully",
    data: result,
  });
});

const deleteEvent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user!;
  const result = await eventService.deleteEventFromDB(
    id as string,
    user.id,
    user.role,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Event deleted successfully",
    data: result,
  });
});

export const eventController = {
  createEvent,
  getAllEvents,
  getSingleEvent,
  getMyEvents,
  updateEvent,
  deleteEvent,
};
