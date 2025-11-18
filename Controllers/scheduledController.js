const ScheduledPost = require("../Models/ScheduledPost");
const publishToInstagram = require("../Services/instagramService");

// GET: Fetch all scheduled posts
exports.getPosts = async (req, res) => {
    try {
        const posts = await ScheduledPost.find().sort({ scheduleTime: 1 });
        res.json({ success: true, posts });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to fetch posts" });
    }
};

// POST: Create scheduled post
exports.createPost = async (req, res) => {
    try {
        const { imageUrl, caption, scheduleTime, instagramBusinessId, accessToken } = req.body;

        if (!imageUrl || !scheduleTime)
            return res.status(400).json({ success: false, message: "Image URL & schedule time are required" });

        // Convert local browser time to UTC
        const localDate = new Date(scheduleTime); // browser sends local time
        const scheduleTimeUTC = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);

        const post = await ScheduledPost.create({
            imageUrl,
            caption,
            scheduleTime: scheduleTimeUTC,
            instagramBusinessId,
            accessToken,
            status: "PENDING",
        });

        res.json({ success: true, post });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to create scheduled post" });
    }
};




// PATCH: Publish immediately
exports.publishNow = async (req, res) => {
    try {
        const { postId } = req.body;

        const post = await ScheduledPost.findById(postId);
        if (!post)
            return res.status(404).json({ success: false, message: "Post not found" });

        const result = await publishToInstagram(
            post.instagramBusinessId,
            post.accessToken,
            post.imageUrl,
            post.caption
        );

        if (!result.success) {
            post.status = "FAILED";
            await post.save();
            return res.status(500).json({ success: false, message: result.error });
        }

        post.status = "PUBLISHED";
        post.creationId = result.creationId;
        post.publishedAt = new Date();
        await post.save();

        res.json({ success: true, post });

    } catch (err) {
        res.status(500).json({ success: false, message: "Internal error during publishing" });
    }
};


// DELETE: Remove scheduled post
exports.deletePost = async (req, res) => {
    try {
        const { postId } = req.body;

        const deleted = await ScheduledPost.findByIdAndDelete(postId);

        if (!deleted)
            return res.status(404).json({ success: false, message: "Post not found" });

        res.json({ success: true, message: "Post deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to delete post" });
    }
};
