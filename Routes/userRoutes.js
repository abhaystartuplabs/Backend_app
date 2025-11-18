// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { getUsers, createUser } = require("../Controllers/userController");

router.get("/", getUsers);
router.post("/", createUser);

module.exports = router;
