import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { created, handleApiError } from "@/lib/response";
import { NotFoundError } from "@/lib/errors";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ shareToken: string }> }
) {
  try {
    const session = await requireSession();
    const { shareToken } = await params;

    // Load original trip, stops, and itinerary items
    const share = await prisma.tripShare.findUnique({
      where: { shareToken },
      include: {
        trip: {
          include: {
            stops: {
              include: {
                itineraryItems: true,
              },
            },
          },
        },
      },
    });

    if (!share || !share.isActive) {
      throw new NotFoundError("Shared trip not found or link has been disabled");
    }

    if (share.expiresAt && new Date(share.expiresAt) < new Date()) {
      throw new NotFoundError("Shared trip link has expired");
    }

    // Copy trip and its stops/itineraries inside an interactive transaction
    const newTrip = await prisma.$transaction(async (tx) => {
      const originalTrip = share.trip;

      // 1. Create a completely new Trip with the copier as the owner
      const createdTrip = await tx.trip.create({
        data: {
          title: `${originalTrip.title} (Copy)`,
          description: originalTrip.description,
          coverImage: originalTrip.coverImage,
          status: "DRAFT", // reset copied trip to DRAFT state
          startDate: originalTrip.startDate,
          endDate: originalTrip.endDate,
          budget: originalTrip.budget,
          currency: originalTrip.currency,
          userId: session.sub,
        },
      });

      // 2. Iterate and copy trip stops and preserve itinerary items
      for (const stop of originalTrip.stops) {
        const createdStop = await tx.tripStop.create({
          data: {
            tripId: createdTrip.id,
            cityId: stop.cityId,
            visitOrder: stop.visitOrder,
            arrivalDate: stop.arrivalDate,
            departureDate: stop.departureDate,
            notes: stop.notes,
          },
        });

        // 3. Copy the itinerary items belonging to this stop
        for (const item of stop.itineraryItems) {
          await tx.itineraryItem.create({
            data: {
              tripId: createdTrip.id,
              tripStopId: createdStop.id,
              activityId: item.activityId,
              itemDate: item.itemDate,
              dayNumber: item.dayNumber,
              startTime: item.startTime,
              endTime: item.endTime,
              sortOrder: item.sortOrder,
              notes: item.notes,
            },
          });
        }
      }

      return createdTrip;
    });

    return created(newTrip);
  } catch (error) {
    return handleApiError(error);
  }
}
