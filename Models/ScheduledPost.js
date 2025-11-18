// models/ScheduledPost.js
const mongoose = require("mongoose");

const ScheduledPostSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  caption: { type: String },
  scheduleTime: { type: Date, required: true },
  status: { type: String, default: "PENDING" }, // PENDING | PUBLISHED | FAILED
  instagramBusinessId: { type: String, required: true },
  accessToken: { type: String, required: true },
  creationId: { type: String }, // Instagram creation ID after publishing
  publishedAt: { type: Date }
});

module.exports = mongoose.model("ScheduledPost", ScheduledPostSchema);
