import express from "express";
import { UserRole } from "../../constants/user";
import authMiddleware from "../../middlewares/authMiddleware";
import validateRequest from "../../middlewares/validateRequest";
import { joinRequestController } from "./joinRequest.controller";
import { joinRequestValidation } from "./joinRequest.validation";

const router = express.Router();

router.get(
  "/my-requests",
  authMiddleware(UserRole.ADMIN, UserRole.USER),
  joinRequestController.getMyRequests
);

router.get(
  "/organizer/all",
  authMiddleware(UserRole.ADMIN, UserRole.USER),
  joinRequestController.getOrganizerRequests
);

router.get(
  "/event/:eventId",
  authMiddleware(UserRole.ADMIN, UserRole.USER),
  joinRequestController.getEventRequests
);

router.post(
  "/",
  authMiddleware(UserRole.ADMIN, UserRole.USER),
  validateRequest(joinRequestValidation.createJoinRequestSchema),
  joinRequestController.createJoinRequest
);

router.patch(
  "/:id/status",
  authMiddleware(UserRole.ADMIN, UserRole.USER),
  validateRequest(joinRequestValidation.updateJoinRequestStatusSchema),
  joinRequestController.updateJoinRequestStatus
);

export const joinRequestRouter = router;
