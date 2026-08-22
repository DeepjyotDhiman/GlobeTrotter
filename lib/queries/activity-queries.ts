import { prisma } from "@/lib/prisma";
import { ActivityCategory } from "@prisma/client";

/**
 * Searches and filters activities by city, category, or search text.
 */
export async function searchActivities(
  cityId?: string,
  category?: ActivityCategory,
  query?: string,
  limit: number = 10
) {
  const isSqlite = process.env.DATABASE_URL?.startsWith("file:");
  const modeParam = isSqlite ? {} : { mode: "insensitive" as const };

  return prisma.activity.findMany({
    where: {
      ...(cityId ? { cityId } : {}),
      ...(category ? { category } : {}),
      ...(query
        ? {
            OR: [
              { name: { contains: query, ...modeParam } },
              { description: { contains: query, ...modeParam } },
            ],
          }
        : {}),
    },
    take: limit,
    include: {
      city: true,
    },
  });
}

/**
 * Retrieves a single activity by ID.
 */
export async function getActivityById(activityId: string) {
  return prisma.activity.findUnique({
    where: { id: activityId },
    include: {
      city: true,
    },
  });
}
