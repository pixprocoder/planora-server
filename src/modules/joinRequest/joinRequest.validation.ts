import { z } from "zod";

const createJoinRequestSchema = z.object({
  body: z.object({
    eventId: z.string().uuid("Invalid event ID"),
  }),
});

const updateJoinRequestStatusSchema = z.object({
  body: z.object({
    status: z.enum(["PENDING", "APPROVED", "REJECTED", "BANNED"]),
  }),
});

export const joinRequestValidation = {
  createJoinRequestSchema,
  updateJoinRequestStatusSchema,
};
