import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTripById } from "@/lib/queries/trip-queries";
import { ok, noContent, handleApiError } from "@/lib/response";
import { NotFoundError, AuthorizationError } from "@/lib/errors";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ tripId: string; stopId: string }> }
) {
  try {
    const session = await requireSession();
    const { tripId, stopId } = await params;

    const trip = await getTripById(tripId);
    if (!trip) {
      throw new NotFoundError("Trip not found");
    }

    if (trip.userId !== session.sub) {
      throw new AuthorizationError("You are not authorized to modify this trip");
    }

    const stop = await prisma.tripStop.findUnique({
      where: { id: stopId, tripId },
    });

    if (!stop) {
      throw new NotFoundError("Trip stop not found");
    }

    // Run delete and decrement visitOrder of subsequent stops atomically
    await prisma.$transaction([
      prisma.tripStop.delete({
        where: { id: stopId },
      }),
      prisma.tripStop.updateMany({
        where: {
          tripId,
          visitOrder: { gt: stop.visitOrder },
        },
        data: {
          visitOrder: { decrement: 1 },
        },
      }),
    ]);

    return noContent();
  } catch (error) {
    return handleApiError(error);
  }
}
