import express from "express";
import { UserRole } from "../../constants/user";
import authMiddleware from "../../middlewares/authMiddleware";
import validateRequest from "../../middlewares/validateRequest";
import { eventController } from "./event.controller";
import { eventValidation } from "./event.validation";

const router = express.Router();

router.get("/", eventController.getAllEvents);
router.get("/:id", eventController.getSingleEvent);

router.post(
  "/",
  authMiddleware(UserRole.ADMIN, UserRole.USER),
  validateRequest(eventValidation.createEventValidationSchema),
  eventController.createEvent
);

router.patch(
  "/:id",
  authMiddleware(UserRole.ADMIN, UserRole.USER),
  validateRequest(eventValidation.updateEventValidationSchema),
  eventController.updateEvent
);


router.delete(
  "/:id",
  authMiddleware(UserRole.ADMIN, UserRole.USER),
  eventController.deleteEvent
);

export const eventRouter = router;
