import { z } from "zod";

const updateProfileValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    image: z.string().url().optional().nullable(),
  }),
});

const updateUserStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(["ACTIVE", "BANNED"]),
  }),
});

export const userValidation = {
  updateProfileValidationSchema,
  updateUserStatusValidationSchema,
};
