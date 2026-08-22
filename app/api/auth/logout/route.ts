import { clearAuthCookie } from "@/lib/auth";
import { ok, handleApiError } from "@/lib/response";

export async function POST() {
  try {
    await clearAuthCookie();
    return ok({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
