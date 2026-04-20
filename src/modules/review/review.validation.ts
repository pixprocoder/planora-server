import { z } from "zod";

const createReviewValidationSchema = z.object({
  body: z.object({
    eventId: z.string().uuid("Invalid event ID"),
    rating: z.number().int().min(1).max(5),
    comment: z.string().optional(),
  }),
});

export const reviewValidation = {
  createReviewValidationSchema,
};
