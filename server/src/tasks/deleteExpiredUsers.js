import cron from "node-cron";
import User from "../models/user.model.js";

// Daily at midnight
cron.schedule("0 0 * * *", async () => {
  const now = new Date();

  try {
    const result = await User.deleteMany({
      isDeleted: true,
      deletionScheduledAt: { $lte: now },
    });

    console.log(
      `[${now.toISOString()}] Purged ${result.deletedCount} soft-deleted users.`
    );
  } catch (err) {
    console.error("Failed to purge expired users:", err.message);
  }
});
