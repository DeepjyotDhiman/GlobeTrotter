import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTripById } from "@/lib/queries/trip-queries";
import { updateExpenseSchema } from "@/lib/validations/expense-schema";
import { ok, noContent, handleApiError } from "@/lib/response";
import { NotFoundError, AuthorizationError } from "@/lib/errors";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ tripId: string; expenseId: string }> }
) {
  try {
    const session = await requireSession();
    const { tripId, expenseId } = await params;
    const body = await request.json();
    const validatedData = updateExpenseSchema.parse(body);

    const trip = await getTripById(tripId);
    if (!trip) {
      throw new NotFoundError("Trip not found");
    }

    if (trip.userId !== session.sub) {
      throw new AuthorizationError("You are not authorized to modify this trip");
    }

    const expense = await prisma.expense.findUnique({
      where: { id: expenseId },
    });

    if (!expense || expense.tripId !== tripId) {
      throw new NotFoundError("Expense not found in this trip");
    }

    const updatedExpense = await prisma.expense.update({
      where: { id: expenseId },
      data: {
        amount: validatedData.amount !== undefined ? validatedData.amount : undefined,
        currency: validatedData.currency !== undefined ? validatedData.currency : undefined,
        category: validatedData.category !== undefined ? validatedData.category : undefined,
        description: validatedData.description !== undefined ? validatedData.description : undefined,
        expenseDate: validatedData.expenseDate !== undefined ? new Date(validatedData.expenseDate) : undefined,
      },
    });

    return ok(updatedExpense);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ tripId: string; expenseId: string }> }
) {
  try {
    const session = await requireSession();
    const { tripId, expenseId } = await params;

    const trip = await getTripById(tripId);
    if (!trip) {
      throw new NotFoundError("Trip not found");
    }

    if (trip.userId !== session.sub) {
      throw new AuthorizationError("You are not authorized to modify this trip");
    }

    const expense = await prisma.expense.findUnique({
      where: { id: expenseId },
    });

    if (!expense || expense.tripId !== tripId) {
      throw new NotFoundError("Expense not found in this trip");
    }

    await prisma.expense.delete({
      where: { id: expenseId },
    });

    return noContent();
  } catch (error) {
    return handleApiError(error);
  }
}
