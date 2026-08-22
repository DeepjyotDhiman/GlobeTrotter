import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTripById } from "@/lib/queries/trip-queries";
import { createExpenseSchema } from "@/lib/validations/expense-schema";
import { ok, created, handleApiError } from "@/lib/response";
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

    const expenses = await prisma.expense.findMany({
      where: { tripId },
      orderBy: { expenseDate: "desc" },
    });

    return ok(expenses);
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
    const validatedData = createExpenseSchema.parse(body);

    const trip = await getTripById(tripId);
    if (!trip) {
      throw new NotFoundError("Trip not found");
    }

    if (trip.userId !== session.sub) {
      throw new AuthorizationError("You are not authorized to modify this trip");
    }

    const expense = await prisma.expense.create({
      data: {
        tripId,
        userId: session.sub,
        amount: validatedData.amount,
        currency: validatedData.currency,
        category: validatedData.category,
        description: validatedData.description,
        expenseDate: new Date(validatedData.expenseDate),
      },
    });

    return created(expense);
  } catch (error) {
    return handleApiError(error);
  }
}
