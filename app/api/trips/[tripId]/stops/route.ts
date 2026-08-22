import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTripById } from "@/lib/queries/trip-queries";
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

    const stops = await prisma.tripStop.findMany({
      where: { tripId },
      orderBy: { visitOrder: "asc" },
      include: { city: true },
    });

    return ok(stops);
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

    const { cityId, arrivalDate, departureDate, notes } = body;
    if (!cityId) {
      throw new ValidationError("City ID is required");
    }

    const trip = await getTripById(tripId);
    if (!trip) {
      throw new NotFoundError("Trip not found");
    }

    if (trip.userId !== session.sub) {
      throw new AuthorizationError("You are not authorized to modify this trip");
    }

    const city = await prisma.city.findUnique({
      where: { id: cityId },
    });
    if (!city) {
      throw new NotFoundError("City not found");
    }

    // Determine visitOrder: get count of existing stops
    const existingCount = await prisma.tripStop.count({
      where: { tripId },
    });

    const stop = await prisma.tripStop.create({
      data: {
        tripId,
        cityId,
        visitOrder: existingCount,
        arrivalDate: arrivalDate ? new Date(arrivalDate) : null,
        departureDate: departureDate ? new Date(departureDate) : null,
        notes: notes || null,
      },
      include: { city: true },
    });

    return created(stop);
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
    const { stops } = body; // Array of { id: string, visitOrder: number }

    if (!Array.isArray(stops)) {
      throw new ValidationError("Stops array is required for reordering");
    }

    const trip = await getTripById(tripId);
    if (!trip) {
      throw new NotFoundError("Trip not found");
    }

    if (trip.userId !== session.sub) {
      throw new AuthorizationError("You are not authorized to modify this trip");
    }

    // Run reordering inside a transaction
    await prisma.$transaction(
      stops.map((stop) =>
        prisma.tripStop.update({
          where: { id: stop.id, tripId },
          data: { visitOrder: stop.visitOrder },
        })
      )
    );

    return ok({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
