// app/api/reels/bulk/route.js
import mongoose from "mongoose";
import { ok, badRequest, serverError } from "../../../../lib/apiResponse";
import ReelsModel from "../../../../database/models/ReelsModel";
import connectToDatabase from "../../../../database/mongoose";

// POST body: { action: "delete" | "activate" | "deactivate" | "feature" | "unfeature", ids: string[] }
export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const { action, ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0)
      return badRequest("ids must be a non-empty array");

    if (ids.length > 100)
      return badRequest("Cannot bulk-operate on more than 100 reels at once");

    const validIds = ids.filter((id) => mongoose.Types.ObjectId.isValid(id));
    if (validIds.length === 0)
      return badRequest("No valid reel IDs provided");

    const filter = { _id: { $in: validIds } };
    let result;

    switch (action) {
      case "delete":
        result = await ReelsModel.deleteMany(filter);
        return ok({
          message: `${result.deletedCount} reel(s) deleted`,
          deletedCount: result.deletedCount,
        });

      case "activate":
        result = await ReelsModel.updateMany(filter, { $set: { isActive: true } });
        return ok({ message: `${result.modifiedCount} reel(s) activated`, modifiedCount: result.modifiedCount });

      case "deactivate":
        result = await ReelsModel.updateMany(filter, { $set: { isActive: false } });
        return ok({ message: `${result.modifiedCount} reel(s) deactivated`, modifiedCount: result.modifiedCount });

      case "feature":
        result = await ReelsModel.updateMany(filter, { $set: { isFeatured: true } });
        return ok({ message: `${result.modifiedCount} reel(s) featured`, modifiedCount: result.modifiedCount });

      case "unfeature":
        result = await ReelsModel.updateMany(filter, { $set: { isFeatured: false } });
        return ok({ message: `${result.modifiedCount} reel(s) unfeatured`, modifiedCount: result.modifiedCount });

      case "pin":
        result = await ReelsModel.updateMany(filter, { $set: { isPinned: true } });
        return ok({ message: `${result.modifiedCount} reel(s) pinned`, modifiedCount: result.modifiedCount });

      case "unpin":
        result = await ReelsModel.updateMany(filter, { $set: { isPinned: false } });
        return ok({ message: `${result.modifiedCount} reel(s) unpinned`, modifiedCount: result.modifiedCount });

      default:
        return badRequest(
          `Invalid action. Must be one of: delete, activate, deactivate, feature, unfeature, pin, unpin`
        );
    }
  } catch (error) {
    return serverError("Bulk operation failed", error);
  }
}