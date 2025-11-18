const express = require("express");
const router = express.Router();
const {
    getPosts,
    createPost,
    publishNow,
    deletePost
} = require("../Controllers/scheduledController");

router.get("/", getPosts);
router.post("/", createPost);
router.patch("/", publishNow);
router.delete("/", deletePost);

module.exports = router;
