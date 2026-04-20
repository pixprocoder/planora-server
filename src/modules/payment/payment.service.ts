import Stripe from "stripe";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";

const stripe = new Stripe(config.stripe.secret_key as string, {
  apiVersion: "2026-03-25.dahlia",
});

const createCheckoutSession = async (eventId: string, userId: string) => {
  // 1. Fetch event and user
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new AppError(404, "Event not found");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  // 2. Ensure user isn't the organizer
  if (event.organizerId === userId) {
    throw new AppError(400, "Organizers cannot pay to join their own events");
  }

  // 3. Upsert JoinRequest (PENDING)
  const joinRequest = await prisma.joinRequest.upsert({
    where: {
      eventId_userId: { eventId, userId },
    },
    update: {}, // Don't change if already exists
    create: {
      eventId,
      userId,
      paymentStatus: "PENDING",
    },
  });

  if (joinRequest.paymentStatus === "COMPLETED") {
    throw new AppError(400, "You have already paid for this event");
  }

  // 4. Matrix Validation
  // 4.1. Free Event Guard
  if (event.fee <= 0) {
    throw new AppError(400, "This event is free and does not require payment");
  }

  // 4.2. Private Event Guard: Must be approved correctly by organizer first
  if (event.visibility === "PRIVATE" && joinRequest.status !== "APPROVED") {
    throw new AppError(
      403,
      "Your request must be approved by the organizer before you can pay",
    );
  }


  // 4. Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: event.title,
            description: event.description,
          },
          unit_amount: Math.round(event.fee * 100), // Convert to cents
        },
        quantity: 1,
      },
    ],
    metadata: {
      requestId: joinRequest.id,
      eventId: event.id,
      userId: user.id,
    },
    success_url: `${config.client_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.client_url}/events/${event.id}`,

    customer_email: user.email,
  });

  return session.url;
};

const fulfillOrder = async (session: Stripe.Checkout.Session) => {
  const metadata = session.metadata;
  if (!metadata || !metadata.requestId) return;

  const requestId = metadata.requestId;
  const transactionId = session.payment_intent as string;

  // Update JoinRequest status
  await prisma.joinRequest.update({
    where: { id: requestId },
    data: {
      paymentStatus: "COMPLETED",
      status: "APPROVED", // Auto-approve paid events
      transactionId,
    },
  });
};

export const paymentService = {
  createCheckoutSession,
  fulfillOrder,
  stripe,
};
