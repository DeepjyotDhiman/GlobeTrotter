import { prisma } from "@/lib/prisma";
import { ExpenseCategory } from "@prisma/client";

/**
 * Fetches all trips belonging to a user, ordered by last updated.
 */
export async function getTripsForUser(userId: string) {
  return prisma.trip.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: {
      stops: {
        orderBy: { visitOrder: "asc" },
        select: {
          id: true,
          visitOrder: true,
          city: {
            select: {
              name: true,
              country: true,
              countryCode: true,
              imageUrl: true,
            },
          },
        },
      },
      _count: {
        select: {
          stops: true,
          expenses: true,
        },
      },
    },
  });
}

/**
 * Basic lookup for a single trip by ID.
 */
export async function getTripById(tripId: string) {
  return prisma.trip.findUnique({
    where: { id: tripId },
  });
}

/**
 * Fetches a single trip with stops, cities, itinerary items, and expenses eagerly loaded.
 */
export async function getTripWithDetails(tripId: string) {
  return prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      stops: {
        orderBy: { visitOrder: "asc" },
        include: {
          city: true,
          itineraryItems: {
            orderBy: { sortOrder: "asc" },
            include: {
              activity: true,
            },
          },
        },
      },
      expenses: {
        orderBy: { expenseDate: "desc" },
      },
      share: true,
    },
  });
}

/**
 * Calculates budget summaries server-side to prevent floating-point calculation leaks in the client.
 */
export async function getBudgetSummary(tripId: string) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: {
      budget: true,
      currency: true,
    },
  });

  if (!trip) return null;

  const expenses = await prisma.expense.findMany({
    where: { tripId },
    select: {
      amount: true,
      category: true,
    },
  });

  const totalBudget = trip.budget ? Number(trip.budget) : null;
  let totalSpent = 0;
  
  const byCategory: Record<ExpenseCategory, number> = {
    ACCOMMODATION: 0,
    TRANSPORT: 0,
    FOOD: 0,
    ACTIVITIES: 0,
    SHOPPING: 0,
    HEALTH: 0,
    COMMUNICATION: 0,
    OTHER: 0,
  };

  for (const expense of expenses) {
    const val = Number(expense.amount);
    totalSpent += val;
    byCategory[expense.category] += val;
  }

  const remaining = totalBudget !== null ? totalBudget - totalSpent : null;
  
  // Safe calculation for percentage used, avoiding division by zero
  const percentageUsed = totalBudget !== null && totalBudget > 0 
    ? parseFloat(((totalSpent / totalBudget) * 100).toFixed(2)) 
    : 0;

  return {
    totalBudget,
    totalSpent,
    remaining,
    percentageUsed,
    byCategory,
    currency: trip.currency,
  };
}

