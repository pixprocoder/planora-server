import { Request, Response } from "express";
import catchAsync from "../../helpers/catchAsync";
import sendResponse from "../../helpers/sendResponseHelper";
import { paymentService } from "./payment.service";
import config from "../../config";
import { Stripe } from "stripe";



const createCheckoutSession = catchAsync(async (req: Request, res: Response) => {
  const { eventId } = req.body;
  const user = req.user!;
  
  const checkoutUrl = await paymentService.createCheckoutSession(eventId, user.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Checkout session created successfully",
    data: { checkoutUrl },
  });
});

const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;
  let event: any;

  try {
    // Stripe needs the raw body (Buffer)
    event = paymentService.stripe.webhooks.constructEvent(
      req.body,
      sig,
      config.stripe.webhook_secret as string
    );
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    await paymentService.fulfillOrder(session);
  }


  res.json({ received: true });
};

export const paymentController = {
  createCheckoutSession,
  handleWebhook,
};
