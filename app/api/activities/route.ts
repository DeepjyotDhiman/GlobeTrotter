import { NextRequest } from "next/server";
import { searchActivities } from "@/lib/queries/activity-queries";
import { ok, handleApiError } from "@/lib/response";
import { ValidationError } from "@/lib/errors";
import { ActivityCategory } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const cityId = searchParams.get("cityId") || undefined;
    const query = searchParams.get("q") || undefined;
    
    const categoryParam = searchParams.get("category");
    let category: ActivityCategory | undefined = undefined;
    
    if (categoryParam) {
      if (Object.values(ActivityCategory).includes(categoryParam as ActivityCategory)) {
        category = categoryParam as ActivityCategory;
      } else {
        throw new ValidationError(`Invalid activity category: "${categoryParam}"`);
      }
    }

    const limitParam = searchParams.get("limit");
    let limit = 10;
    if (limitParam) {
      const parsed = parseInt(limitParam, 10);
      if (!isNaN(parsed) && parsed > 0) {
        limit = Math.min(parsed, 50);
      }
    }

    const activities = await searchActivities(cityId, category, query, limit);
    return ok(activities);
  } catch (error) {
    return handleApiError(error);
  }
}
