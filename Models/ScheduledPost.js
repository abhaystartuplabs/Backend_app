const mongoose = require("mongoose");

const ScheduledPostSchema = new mongoose.Schema({
    imageUrl: String,
    caption: String,
    scheduleTime: Date,
    creationId: String,
    publishedAt: Date,
    status: {
        type: String,
        enum: ["PENDING", "PUBLISHED", "FAILED"],
        default: "PENDING",
    }
});

module.exports = mongoose.model("ScheduledPost", ScheduledPostSchema);
