import { z } from "zod";

/**
 * Registration validation schema
 */
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim(),
  email: z
    .string()
    .email("Invalid email address")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must not exceed 128 characters"),
});

/**
 * Login validation schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, "Password is required"),
});

/**
 * User Profile Update validation schema
 */
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim()
    .optional(),
  avatarUrl: z
    .string()
    .url("Invalid avatar URL")
    .nullable()
    .optional(),
  bio: z
    .string()
    .max(500, "Bio must not exceed 500 characters")
    .nullable()
    .optional(),
});

// Infer TypeScript compile-time types from Zod definitions
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

