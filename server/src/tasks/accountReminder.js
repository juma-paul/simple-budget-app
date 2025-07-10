import cron from "node-cron";
import User from "../models/user.model.js";
import sendEmail from "../utils/sendEmail.js";

// Daily at midnight
cron.schedule("0 0 * * *", async () => {
  const now = new Date();
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  try {
    const usersToNotify = await User.find({
      isDeleted: true,
      deletionScheduledAt: {
        $lte: threeDaysFromNow,
        $gt: now,
      },
      notified: { $ne: true },
    });

    for (const user of usersToNotify) {
      try {
        await sendEmail({
          to: user.email,
          subject: "Account Deletion Notice",
          text: `
                Hi ${user.username},

                Your account is scheduled to be permanently deleted in 3 days. If this was a mistake, please log in to restore your account.

                If you need help or have questions, feel free to reach out to our support team.

                —
                Customer Support
                The Simple Budget App
                `,
        });

        user.notified = true;
        await user.save();
      } catch (err) {
        console.error(`Failed to send email to ${user.email}:`, err.message);
      }
    }

    console.log(`Sent deletion reminders to ${usersToNotify.length} users.`);
  } catch (err) {
    console.error("Reminder job failed:", err.message);
  }
});
