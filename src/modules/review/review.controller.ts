import { Request, Response } from "express";
import catchAsync from "../../helpers/catchAsync";
import sendResponse from "../../helpers/sendResponseHelper";
import { reviewService } from "./review.service";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const user = req.user!;
  const result = await reviewService.createReviewIntoDB(req.body, user.id);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Review submitted successfully",
    data: result,
  });
});

const getEventReviews = catchAsync(async (req: Request, res: Response) => {
  const { eventId } = req.params;
  const result = await reviewService.getEventReviewsFromDB(eventId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Reviews retrieved successfully",
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user!;
  const result = await reviewService.deleteReviewFromDB(id as string, user.id, user.role);


  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Review deleted successfully",
    data: result,
  });
});

export const reviewController = {
  createReview,
  getEventReviews,
  deleteReview,
};
