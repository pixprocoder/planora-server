import { z } from "zod";

const createCheckoutSessionSchema = z.object({
  body: z.object({
    eventId: z.string().uuid("Invalid event ID"),
  }),
});

export const paymentValidation = {
  createCheckoutSessionSchema,
};
