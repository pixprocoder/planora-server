import express from "express";
import { UserRole } from "../../constants/user";
import authMiddleware from "../../middlewares/authMiddleware";
import { adminController } from "./admin.controller";

const router = express.Router();

router.get(
  "/stats",
  authMiddleware(UserRole.ADMIN),
  adminController.getDashboardStats
);

export const adminRouter = router;
