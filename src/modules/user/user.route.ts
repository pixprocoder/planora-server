import express from "express";
import { UserRole } from "../../constants/user";
import authMiddleware from "../../middlewares/authMiddleware";
import { userController } from "./user.controller";
import { userValidation } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();


router.get("/me", authMiddleware(UserRole.ADMIN, UserRole.USER), userController.getMyProfile);
router.get("/", authMiddleware(UserRole.ADMIN), userController.getAllUsers);

router.patch(
  "/profile",
  authMiddleware(UserRole.ADMIN, UserRole.USER),
  validateRequest(userValidation.updateProfileValidationSchema),
  userController.updateProfile
);

router.patch(
  "/status/:id",
  authMiddleware(UserRole.ADMIN),
  validateRequest(userValidation.updateUserStatusValidationSchema),
  userController.updateUserStatus
);

export const userRouter = router;

