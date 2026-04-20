import express from "express";
import { UserRole } from "../../constants/user";
import authMiddleware from "../../middlewares/authMiddleware";
import validateRequest from "../../middlewares/validateRequest";
import { reviewController } from "./review.controller";
import { reviewValidation } from "./review.validation";

const router = express.Router();

router.get("/event/:eventId", reviewController.getEventReviews);

router.post(
  "/",
  authMiddleware(UserRole.ADMIN, UserRole.USER),
  validateRequest(reviewValidation.createReviewValidationSchema),
  reviewController.createReview
);

router.delete(
  "/:id",
  authMiddleware(UserRole.ADMIN, UserRole.USER),
  reviewController.deleteReview
);

export const reviewRouter = router;
