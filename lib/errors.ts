export type ErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "DATABASE_ERROR"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly status: number;
  public readonly fields?: Record<string, string[]>;

  constructor(
    message: string,
    code: ErrorCode,
    status: number,
    fields?: Record<string, string[]>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.status = status;
    this.fields = fields;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class ValidationError extends AppError {
  constructor(message: string = "Validation failed", fields?: Record<string, string[]>) {
    super(message, "VALIDATION_ERROR", 400, fields);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication failed") {
    super(message, "UNAUTHORIZED", 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "Access denied") {
    super(message, "FORBIDDEN", 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, "NOT_FOUND", 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Conflict occurred") {
    super(message, "CONFLICT", 409);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = "Database operation failed") {
    super("An internal database error occurred", "DATABASE_ERROR", 500);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = "An unexpected error occurred") {
    super(message, "INTERNAL_ERROR", 500);
  }
}

export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  // Safe checks for database/Prisma errors
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    typeof (error as any).code === "string" &&
    (error as any).code.startsWith("P")
  ) {
    console.error("[Database Error Details]:", error);
    return new DatabaseError();
  }

  if (error instanceof Error) {
    console.error("[Internal Server Error Details]:", error);
    return new InternalServerError(error.message);
  }

  console.error("[Unknown Error Details]:", error);
  return new InternalServerError();
}
