import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTripById, getTripWithDetails } from "@/lib/queries/trip-queries";
import { updateTripSchema } from "@/lib/validations/trip-schema";
import { ok, noContent, handleApiError } from "@/lib/response";
import { NotFoundError, AuthorizationError } from "@/lib/errors";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const session = await requireSession();
    const { tripId } = await params;

    const trip = await getTripWithDetails(tripId);
    if (!trip) {
      throw new NotFoundError("Trip not found");
    }

    if (trip.userId !== session.sub) {
      throw new AuthorizationError("You are not authorized to view this trip");
    }

    return ok(trip);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const session = await requireSession();
    const { tripId } = await params;
    const body = await request.json();
    const validatedData = updateTripSchema.parse(body);

    const trip = await getTripById(tripId);
    if (!trip) {
      throw new NotFoundError("Trip not found");
    }

    if (trip.userId !== session.sub) {
      throw new AuthorizationError("You are not authorized to modify this trip");
    }

    const updatedTrip = await prisma.trip.update({
      where: { id: tripId },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        coverImage: validatedData.coverImage,
        status: validatedData.status,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : undefined,
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : undefined,
        budget: validatedData.budget,
        currency: validatedData.currency,
      },
    });

    return ok(updatedTrip);
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
      throw new AuthorizationError("You are not authorized to delete this trip");
    }

    await prisma.trip.delete({
      where: { id: tripId },
    });

    return noContent();
  } catch (error) {
    return handleApiError(error);
  }
}
