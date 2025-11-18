// routes/gmbRoutes.js
const express = require('express');
const { protect } = require('../Middlewares/authMiddleware'); // 👈 Import middleware
const { getAccounts,getReviews } = require('../Controllers/gmbController'); // 👈 Import controller

const router = express.Router();

// Route for fetching reviews
// Middleware 'protect' runs first to verify token, then 'getReviews' executes.
router.get('/accounts', protect, getAccounts);
router.get('/reviews', protect, getReviews);

module.exports = router;