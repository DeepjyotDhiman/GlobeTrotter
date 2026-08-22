import { z } from "zod";

export const createItineraryItemSchema = z.object({
  tripStopId: z.string().cuid("Invalid trip stop ID"),
  activityId: z.string().cuid("Invalid activity ID"),
  itemDate: z.string().datetime("Invalid date format").optional().nullable(),
  dayNumber: z.number().int().positive("Day number must be positive").optional().nullable(),
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Start time must be HH:MM format")
    .optional()
    .nullable(),
  endTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "End time must be HH:MM format")
    .optional()
    .nullable(),
  sortOrder: z.number().int().min(0, "Sort order must be non-negative"),
  notes: z.string().max(1000, "Notes must not exceed 1000 characters").optional().nullable(),
});

export const updateItineraryItemSchema = createItineraryItemSchema.partial();

