import { loginSchema } from "@/lib/validations/user-schema";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signToken, setAuthCookie } from "@/lib/auth";
import { ok, handleApiError } from "@/lib/response";
import { AuthenticationError } from "@/lib/errors";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = loginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      throw new AuthenticationError("Invalid email or password");
    }

    const isPasswordValid = await verifyPassword(
      validatedData.password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      throw new AuthenticationError("Invalid email or password");
    }

    const token = await signToken({
      sub: user.id,
      email: user.email,
      name: user.name,
    });

    await setAuthCookie(token);

    return ok({
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
