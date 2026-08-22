import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ok, handleApiError } from "@/lib/response";
import { NotFoundError } from "@/lib/errors";

export async function GET() {
  try {
    const session = await requireSession();

    const user = await prisma.user.findUnique({
      where: { id: session.sub },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return ok({
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      createdAt: user.createdAt,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
