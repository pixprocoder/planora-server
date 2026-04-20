import express from "express";
import { UserRole } from "../../constants/user";
import authMiddleware from "../../middlewares/authMiddleware";
import validateRequest from "../../middlewares/validateRequest";
import { paymentController } from "./payment.controller";
import { paymentValidation } from "./payment.validation";

const router = express.Router();

// Webhook must be BEFORE the json middleware or handled specifically in app.ts
// We already handled the conditional body parsing in app.ts, so this will receive raw body for /webhook
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paymentController.handleWebhook
);

router.post(
  "/create-checkout-session",
  authMiddleware(UserRole.ADMIN, UserRole.USER),
  validateRequest(paymentValidation.createCheckoutSessionSchema),
  paymentController.createCheckoutSession
);

export const paymentRouter = router;
