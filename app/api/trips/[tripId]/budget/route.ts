import { requireSession } from "@/lib/auth";
import { getTripById, getBudgetSummary } from "@/lib/queries/trip-queries";
import { ok, handleApiError } from "@/lib/response";
import { NotFoundError, AuthorizationError } from "@/lib/errors";

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

    const summary = await getBudgetSummary(tripId);
    if (!summary) {
      throw new NotFoundError("Trip not found");
    }

    return ok(summary);
  } catch (error) {
    return handleApiError(error);
  }
}
