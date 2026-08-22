import { NextResponse } from "next/server";
import { ErrorCode, normalizeError } from "./errors";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  meta?: Record<string, any>;
  error?: {
    code: ErrorCode;
    message: string;
    fields?: Record<string, string[]>;
  };
}

export function ok<T>(data: T, meta?: Record<string, any>): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(meta ? { meta } : {}),
    },
    { status: 200 }
  );
}

export function created<T>(data: T): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status: 201 }
  );
}

export function noContent(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

export function badRequest(
  message: string = "Invalid request",
  fields?: Record<string, string[]>
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message,
        ...(fields ? { fields } : {}),
      },
    },
    { status: 400 }
  );
}

export function unauthorized(message: string = "Unauthorized"): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message,
      },
    },
    { status: 401 }
  );
}

export function forbidden(message: string = "Access denied"): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "FORBIDDEN",
        message,
      },
    },
    { status: 403 }
  );
}

export function notFound(message: string = "Resource not found"): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "NOT_FOUND",
        message,
      },
    },
    { status: 404 }
  );
}

export function conflict(message: string = "Conflict occurred"): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "CONFLICT",
        message,
      },
    },
    { status: 409 }
  );
}

export function serverError(message: string = "An unexpected error occurred"): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message,
      },
    },
    { status: 500 }
  );
}

export function handleApiError(error: unknown): NextResponse<ApiResponse> {
  const normalized = normalizeError(error);

  switch (normalized.code) {
    case "VALIDATION_ERROR":
      return badRequest(normalized.message, normalized.fields);
    case "UNAUTHORIZED":
      return unauthorized(normalized.message);
    case "FORBIDDEN":
      return forbidden(normalized.message);
    case "NOT_FOUND":
      return notFound(normalized.message);
    case "CONFLICT":
      return conflict(normalized.message);
    case "DATABASE_ERROR":
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "DATABASE_ERROR",
            message: normalized.message,
          },
        },
        { status: 500 }
      );
    default:
      return serverError(normalized.message);
  }
}
