import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTripById } from "@/lib/queries/trip-queries";
import { updateItineraryItemSchema } from "@/lib/validations/itinerary-schema";
import { ok, noContent, handleApiError } from "@/lib/response";
import { NotFoundError, AuthorizationError, ValidationError } from "@/lib/errors";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ tripId: string; itemId: string }> }
) {
  try {
    const session = await requireSession();
    const { tripId, itemId } = await params;
    const body = await request.json();
    const validatedData = updateItineraryItemSchema.parse(body);

    const trip = await getTripById(tripId);
    if (!trip) {
      throw new NotFoundError("Trip not found");
    }

    if (trip.userId !== session.sub) {
      throw new AuthorizationError("You are not authorized to modify this trip");
    }

    const item = await prisma.itineraryItem.findUnique({
      where: { id: itemId },
    });

    if (!item || item.tripId !== tripId) {
      throw new NotFoundError("Itinerary item not found in this trip");
    }

    // Determine stopId and activityId for cross-context checks
    const targetStopId = validatedData.tripStopId !== undefined ? validatedData.tripStopId : item.tripStopId;
    const targetActivityId = validatedData.activityId !== undefined ? validatedData.activityId : item.activityId;

    if (validatedData.tripStopId !== undefined || validatedData.activityId !== undefined) {
      if (!targetStopId) {
        throw new ValidationError("Trip stop ID is required");
      }
      
      const tripStop = await prisma.tripStop.findUnique({
        where: { id: targetStopId },
      });

      if (!tripStop) {
        throw new NotFoundError("Trip stop not found");
      }

      if (tripStop.tripId !== tripId) {
        throw new ValidationError("Trip stop does not belong to the specified trip");
      }

      if (!targetActivityId) {
        throw new ValidationError("Activity ID is required");
      }

      const activity = await prisma.activity.findUnique({
        where: { id: targetActivityId },
      });

      if (!activity) {
        throw new NotFoundError("Activity not found");
      }

      if (activity.cityId !== tripStop.cityId) {
        throw new ValidationError("Activity does not belong to the correct city context for this stop");
      }
    }

    const updatedItem = await prisma.itineraryItem.update({
      where: { id: itemId },
      data: {
        tripStopId: validatedData.tripStopId !== undefined ? validatedData.tripStopId : undefined,
        activityId: validatedData.activityId !== undefined ? validatedData.activityId : undefined,
        itemDate: validatedData.itemDate !== undefined ? (validatedData.itemDate ? new Date(validatedData.itemDate) : null) : undefined,
        dayNumber: validatedData.dayNumber !== undefined ? validatedData.dayNumber : undefined,
        startTime: validatedData.startTime !== undefined ? validatedData.startTime : undefined,
        endTime: validatedData.endTime !== undefined ? validatedData.endTime : undefined,
        sortOrder: validatedData.sortOrder !== undefined ? validatedData.sortOrder : undefined,
        notes: validatedData.notes !== undefined ? validatedData.notes : undefined,
      },
      include: {
        tripStop: {
          include: {
            city: true,
          },
        },
        activity: true,
      },
    });

    return ok(updatedItem);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ tripId: string; itemId: string }> }
) {
  try {
    const session = await requireSession();
    const { tripId, itemId } = await params;

    const trip = await getTripById(tripId);
    if (!trip) {
      throw new NotFoundError("Trip not found");
    }

    if (trip.userId !== session.sub) {
      throw new AuthorizationError("You are not authorized to modify this trip");
    }

    const item = await prisma.itineraryItem.findUnique({
      where: { id: itemId },
    });

    if (!item || item.tripId !== tripId) {
      throw new NotFoundError("Itinerary item not found in this trip");
    }

    await prisma.itineraryItem.delete({
      where: { id: itemId },
    });

    return noContent();
  } catch (error) {
    return handleApiError(error);
  }
}
