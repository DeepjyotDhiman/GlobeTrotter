import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTripsForUser } from "@/lib/queries/trip-queries";
import { createTripSchema } from "@/lib/validations/trip-schema";
import { ok, created, handleApiError } from "@/lib/response";

export async function GET() {
  try {
    const session = await requireSession();
    const trips = await getTripsForUser(session.sub);
    return ok(trips);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireSession();
    const body = await request.json();
    const validatedData = createTripSchema.parse(body);

    const trip = await prisma.trip.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        coverImage: validatedData.coverImage,
        status: validatedData.status,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : null,
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
        budget: validatedData.budget,
        currency: validatedData.currency,
        userId: session.sub, // Enforced from session only
      },
    });

    return created(trip);
  } catch (error) {
    return handleApiError(error);
  }
}
