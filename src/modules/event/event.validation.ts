import { z } from "zod";

const createEventValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    date: z.string().min(1, "Date is required"),
    time: z.string().min(1, "Time is required"),
    venue: z.string().min(1, "Venue is required"),
    description: z.string().min(1, "Description is required"),
    visibility: z.enum(["PUBLIC", "PRIVATE"]).optional(),
    fee: z.number().nonnegative().optional(),
    categoryId: z.string().uuid().optional().nullable(),
  }),
});

const updateEventValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    date: z.string().optional(),
    time: z.string().optional(),
    venue: z.string().optional(),
    description: z.string().optional(),
    visibility: z.enum(["PUBLIC", "PRIVATE"]).optional(),
    fee: z.number().nonnegative().optional(),
    categoryId: z.string().uuid().optional().nullable(),
  }),
});

export const eventValidation = {
  createEventValidationSchema,
  updateEventValidationSchema,
};
