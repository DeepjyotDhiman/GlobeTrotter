import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTripById } from "@/lib/queries/trip-queries";
import { createItineraryItemSchema } from "@/lib/validations/itinerary-schema";
import { ok, created, handleApiError } from "@/lib/response";
import { NotFoundError, AuthorizationError, ValidationError } from "@/lib/errors";

export async function GET(
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
      throw new AuthorizationError("You are not authorized to view this trip");
    }

    const items = await prisma.itineraryItem.findMany({
      where: { tripId },
      orderBy: [
        { tripStop: { visitOrder: "asc" } },
        { sortOrder: "asc" },
      ],
      include: {
        tripStop: {
          include: {
            city: true,
          },
        },
        activity: true,
      },
    });

    return ok(items);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const session = await requireSession();
    const { tripId } = await params;
    const body = await request.json();
    const validatedData = createItineraryItemSchema.parse(body);

    const trip = await getTripById(tripId);
    if (!trip) {
      throw new NotFoundError("Trip not found");
    }

    if (trip.userId !== session.sub) {
      throw new AuthorizationError("You are not authorized to modify this trip");
    }

    // Cross-context validation: tripStop must belong to the correct trip
    const tripStop = await prisma.tripStop.findUnique({
      where: { id: validatedData.tripStopId },
    });

    if (!tripStop) {
      throw new NotFoundError("Trip stop not found");
    }

    if (tripStop.tripId !== tripId) {
      throw new ValidationError("Trip stop does not belong to the specified trip");
    }

    // Cross-context validation: activity must belong to the correct city context
    const activity = await prisma.activity.findUnique({
      where: { id: validatedData.activityId },
    });

    if (!activity) {
      throw new NotFoundError("Activity not found");
    }

    if (activity.cityId !== tripStop.cityId) {
      throw new ValidationError("Activity does not belong to the correct city context for this stop");
    }

    const item = await prisma.itineraryItem.create({
      data: {
        tripId,
        tripStopId: validatedData.tripStopId,
        activityId: validatedData.activityId,
        itemDate: validatedData.itemDate ? new Date(validatedData.itemDate) : null,
        dayNumber: validatedData.dayNumber,
        startTime: validatedData.startTime,
        endTime: validatedData.endTime,
        sortOrder: validatedData.sortOrder,
        notes: validatedData.notes,
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

    return created(item);
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
    const { items } = body; // Array of { id: string, sortOrder: number }

    if (!Array.isArray(items)) {
      throw new ValidationError("Items array is required for reordering");
    }

    const trip = await getTripById(tripId);
    if (!trip) {
      throw new NotFoundError("Trip not found");
    }

    if (trip.userId !== session.sub) {
      throw new AuthorizationError("You are not authorized to modify this trip");
    }

    // Run updates in a transaction
    await prisma.$transaction(
      items.map((item) =>
        prisma.itineraryItem.update({
          where: { id: item.id, tripId },
          data: { sortOrder: item.sortOrder },
        })
      )
    );

    return ok({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
