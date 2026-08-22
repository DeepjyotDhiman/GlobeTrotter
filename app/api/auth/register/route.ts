import { registerSchema } from "@/lib/validations/user-schema";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken, setAuthCookie } from "@/lib/auth";
import { created, handleApiError } from "@/lib/response";
import { ConflictError } from "@/lib/errors";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      throw new ConflictError("Email address is already registered");
    }

    const passwordHash = await hashPassword(validatedData.password);

    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        name: validatedData.name,
        passwordHash,
      },
    });

    const token = await signToken({
      sub: user.id,
      email: user.email,
      name: user.name,
    });

    await setAuthCookie(token);

    return created({
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
