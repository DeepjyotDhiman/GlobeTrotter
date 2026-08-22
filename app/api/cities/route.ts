import { NextRequest } from "next/server";
import { searchCities } from "@/lib/queries/city-queries";
import { ok, handleApiError } from "@/lib/response";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    
    const limitParam = searchParams.get("limit");
    let limit = 10;
    if (limitParam) {
      const parsed = parseInt(limitParam, 10);
      if (!isNaN(parsed) && parsed > 0) {
        limit = Math.min(parsed, 50); // clamp to max 50
      }
    }

    const cities = await searchCities(query, limit);
    return ok(cities);
  } catch (error) {
    return handleApiError(error);
  }
}
