import { getCityById } from "@/lib/queries/city-queries";
import { ok, handleApiError } from "@/lib/response";
import { NotFoundError } from "@/lib/errors";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ cityId: string }> }
) {
  try {
    const { cityId } = await params;
    const city = await getCityById(cityId);

    if (!city) {
      throw new NotFoundError("City not found");
    }

    return ok(city);
  } catch (error) {
    return handleApiError(error);
  }
}
