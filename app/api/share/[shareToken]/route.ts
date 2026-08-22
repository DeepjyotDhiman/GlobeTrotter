import { prisma } from "@/lib/prisma";
import { ok, handleApiError } from "@/lib/response";
import { NotFoundError } from "@/lib/errors";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ shareToken: string }> }
) {
  try {
    const { shareToken } = await params;

    const share = await prisma.tripShare.findUnique({
      where: { shareToken },
      include: {
        trip: {
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
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
                bio: true,
              },
            },
          },
        },
      },
    });

    if (!share || !share.isActive) {
      throw new NotFoundError("Shared trip not found or link has been disabled");
    }

    if (share.expiresAt && new Date(share.expiresAt) < new Date()) {
      throw new NotFoundError("Shared trip link has expired");
    }

    // Exclude private owner properties (already handled via select)
    // Exclude private financial details (expenses are omitted from include)
    const trip = share.trip;

    return ok({
      id: trip.id,
      title: trip.title,
      description: trip.description,
      coverImage: trip.coverImage,
      startDate: trip.startDate,
      endDate: trip.endDate,
      stops: trip.stops,
      owner: trip.user,
      createdAt: trip.createdAt,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
