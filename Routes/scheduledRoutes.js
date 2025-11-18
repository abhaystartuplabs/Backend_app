const express = require("express");
const router = express.Router();
const {
    getPosts,
    createPost,
    publishNow,
    deletePost
} = require("../Controllers/scheduledController");

router.get("/getPosts", getPosts);
router.post("/createPost", createPost);
router.patch("/publishNow", publishNow);
router.delete("/deletePost", deletePost);

module.exports = router;
