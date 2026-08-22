import { z } from "zod";

export const createShareSchema = z.object({
  expiresAt: z
    .string()
    .datetime("Invalid expiration date format")
    .optional()
    .nullable(),
});

