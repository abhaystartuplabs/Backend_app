// cron/scheduler.js
const cron = require("node-cron");
const ScheduledPost = require("../Models/ScheduledPost");
const publishToInstagram = require("../Services/instagramService");

cron.schedule("* * * * *", async () => {
  console.log("⏳ Checking scheduled posts...");

  const now = new Date(); // server UTC time
  // Convert now to IST
  const nowIST = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));

  const posts = await ScheduledPost.find({
    status: "PENDING",
    scheduleTime: { $lte: now } // DB stored in UTC
  });

  if (posts.length === 0) return;

  console.log(`📌 Found ${posts.length} posts to publish`);

  for (const post of posts) {
    try {
      const result = await publishToInstagram(
        post.instagramBusinessId,
        post.accessToken,
        post.imageUrl,
        post.caption
      );

      if (result.success) {
        post.status = "PUBLISHED";
        post.creationId = result.creationId;
        post.publishedAt = new Date();
        await post.save();
        console.log("✅ Published:", post._id);
      } else {
        post.status = "FAILED";
        await post.save();
        console.log("❌ Failed:", post._id, result.error);
      }
    } catch (err) {
      post.status = "FAILED";
      await post.save();
      console.log("🔥 Error publishing:", err.message);
    }
  }
});

console.log("🚀 Scheduler started...");
