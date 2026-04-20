import express from "express";
import { UserRole } from "../../constants/user";
import authMiddleware from "../../middlewares/authMiddleware";
import { userController } from "./user.controller";

const router = express.Router();

router.get("/me", authMiddleware(UserRole.ADMIN, UserRole.USER), userController.getMyProfile);
router.get("/", authMiddleware(UserRole.ADMIN), userController.getAllUsers);

export const userRouter = router;
