import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTripById } from "@/lib/queries/trip-queries";
import { createShareSchema } from "@/lib/validations/share-schema";
import { ok, handleApiError } from "@/lib/response";
import { NotFoundError, AuthorizationError } from "@/lib/errors";
import crypto from "crypto";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const session = await requireSession();
    const { tripId } = await params;
    const body = await request.json();
    const validatedData = createShareSchema.parse(body);

    const trip = await getTripById(tripId);
    if (!trip) {
      throw new NotFoundError("Trip not found");
    }

    if (trip.userId !== session.sub) {
      throw new AuthorizationError("You are not authorized to share this trip");
    }

    // Generate cryptographically secure random token (32 bytes = 64 characters hex)
    const token = crypto.randomBytes(32).toString("hex");

    const share = await prisma.tripShare.upsert({
      where: { tripId },
      update: {
        shareToken: token,
        isActive: true,
        expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : null,
      },
      create: {
        tripId,
        shareToken: token,
        createdById: session.sub,
        expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : null,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const shareUrl = `${baseUrl}/share/${share.shareToken}`;

    return ok({
      shareToken: share.shareToken,
      shareUrl,
      isActive: share.isActive,
      expiresAt: share.expiresAt,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const session = await requireSession();
    const { tripId } = await params;

    const trip = await getTripById(tripId);
    if (!trip) {
      throw new NotFoundError("Trip not found");
    }

    if (trip.userId !== session.sub) {
      throw new AuthorizationError("You are not authorized to modify this trip");
    }

    // Revoke share token by deleting the record
    await prisma.tripShare.deleteMany({
      where: { tripId },
    });

    return ok({ success: true, message: "Share link revoked successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}
