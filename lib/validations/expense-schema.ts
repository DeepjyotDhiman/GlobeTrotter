import { z } from "zod";

/**
 * Validation schema for creating an expense
 */
export const createExpenseSchema = z.object({
  amount: z
    .number()
    .positive("Amount must be a positive number"),
  currency: z
    .string()
    .length(3, "Currency must be a 3-letter ISO code")
    .default("USD"),
  category: z.enum([
    "ACCOMMODATION",
    "TRANSPORT",
    "FOOD",
    "ACTIVITIES",
    "SHOPPING",
    "HEALTH",
    "COMMUNICATION",
    "OTHER",
  ]),
  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .optional()
    .nullable(),
  expenseDate: z
    .string()
    .datetime("Invalid date format"),
});

/**
 * Validation schema for updating an existing expense
 */
export const updateExpenseSchema = createExpenseSchema.partial();
