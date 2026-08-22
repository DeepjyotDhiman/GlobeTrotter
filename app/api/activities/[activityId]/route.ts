import { getActivityById } from "@/lib/queries/activity-queries";
import { ok, handleApiError } from "@/lib/response";
import { NotFoundError } from "@/lib/errors";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ activityId: string }> }
) {
  try {
    const { activityId } = await params;
    const activity = await getActivityById(activityId);

    if (!activity) {
      throw new NotFoundError("Activity not found");
    }

    return ok(activity);
  } catch (error) {
    return handleApiError(error);
  }
}
