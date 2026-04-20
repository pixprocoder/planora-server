import express from "express";
import { UserRole } from "../../constants/user";
import authMiddleware from "../../middlewares/authMiddleware";
import validateRequest from "../../middlewares/validateRequest";
import { categoryController } from "./category.controller";
import { categoryValidation } from "./category.validation";

const router = express.Router();

router.get("/", categoryController.getAllCategories);

router.post(
  "/",
  authMiddleware(UserRole.ADMIN),
  validateRequest(categoryValidation.createCategoryValidationSchema),
  categoryController.createCategory,
);

router.delete(
  "/:id",
  authMiddleware(UserRole.ADMIN),
  categoryController.deleteCategory,
);

export const categoryRouter = router;
