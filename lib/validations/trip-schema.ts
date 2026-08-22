import { z } from "zod";

/**
 * Validation schema for creating a trip
 */
export const createTripSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must not exceed 200 characters")
    .trim(),
  description: z
    .string()
    .max(2000, "Description must not exceed 2000 characters")
    .optional()
    .nullable(),
  coverImage: z
    .string()
    .url("Invalid cover image URL")
    .optional()
    .nullable(),
  status: z
    .enum(["DRAFT", "PLANNING", "CONFIRMED", "ACTIVE", "COMPLETED", "CANCELLED"])
    .optional(),
  startDate: z
    .string()
    .datetime("Invalid start date format")
    .optional()
    .nullable(),
  endDate: z
    .string()
    .datetime("Invalid end date format")
    .optional()
    .nullable(),
  budget: z
    .number()
    .positive("Budget must be a positive number")
    .optional()
    .nullable(),
  currency: z
    .string()
    .length(3, "Currency must be a 3-letter ISO code")
    .default("USD"),
});

/**
 * Validation schema for updating an existing trip
 */
export const updateTripSchema = createTripSchema.partial();
