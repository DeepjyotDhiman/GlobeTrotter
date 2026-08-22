import { prisma } from "@/lib/prisma";

/**
 * Searches cities by name or country with a limit.
 */
export async function searchCities(query: string, limit: number = 10) {
  const isSqlite = process.env.DATABASE_URL?.startsWith("file:");
  const modeParam = isSqlite ? {} : { mode: "insensitive" as const };

  return prisma.city.findMany({
    where: {
      OR: [
        { name: { contains: query, ...modeParam } },
        { country: { contains: query, ...modeParam } },
      ],
    },
    take: limit,
    select: {
      id: true,
      name: true,
      country: true,
      countryCode: true,
      imageUrl: true,
      lat: true,
      lng: true,
    },
  });
}

/**
 * Fetches a city by ID and includes its activities.
 */
export async function getCityById(cityId: string) {
  return prisma.city.findUnique({
    where: { id: cityId },
    include: {
      activities: true,
    },
  });
}
