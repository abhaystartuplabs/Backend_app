// controllers/gmbController.js
const { google } = require('googleapis');

// Note: Replace with your known working path
const STARTUP_LABS_LOCATION_NAME = "accounts/110941873856954736511/locations/6242444327013642573"; 

/**
 * @desc Fetches reviews for the known location using the authenticated token.
 * @route GET /api/gmb/reviews
 * @access Protected
 */
const getAccounts = async (req, res) => {
    const accessToken = req.accessToken;

    try {
        const authClient = new google.auth.OAuth2();
        authClient.setCredentials({ access_token: accessToken });

        // 1. Initialize V1 Account Management Client
        const accountMgmt = google.mybusinessaccountmanagement({ 
            version: 'v1', 
            auth: authClient 
        });

        // 2. Fetch Accounts
        const response = await accountMgmt.accounts.list();
        const accounts = response.data.accounts || [];

        if (accounts.length === 0) {
            return res.status(404).json({ message: 'No Google My Business accounts found.' });
        }
        
        // 3. Find the best account ID to use (prioritize non-PERSONAL)
        const primaryAccount = accounts.find(acc => acc.type !== 'PERSONAL') || accounts[0];
        
        // Use the full resource name (accounts/{ID})
        const primaryAccountId = primaryAccount.name; 

        res.status(200).json({ 
            success: true, 
            accountId: primaryAccountId,
            accountType: primaryAccount.type
        });

    } catch (error) {
        console.error("Server Error fetching accounts:", error.message);
        res.status(500).json({ 
            error: 'Failed to fetch account list', 
            details: error.message 
        });
    }
};

const getReviews = async (req, res) => {
    // 1. Get Token from middleware (req.accessToken is attached by protect middleware)
    const accessToken = req.accessToken;

    try {
        // 2. Initialize Auth Client (necessary for using the token)
        const authClient = new google.auth.OAuth2();
        authClient.setCredentials({ access_token: accessToken });

        // 3. Call Google API (using the V4 method proven to work)
        const reviewsUrl = `https://mybusiness.googleapis.com/v4/${STARTUP_LABS_LOCATION_NAME}/reviews`;
        
        const googleResponse = await fetch(reviewsUrl, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        const data = await googleResponse.json();

        if (!googleResponse.ok) {
            console.error("Google API Error:", data);
            // Pass the Google error back to the client
            return res.status(googleResponse.status).json({ 
                error: 'Google API failure', 
                details: data 
            });
        }

        // 4. Send Cleaned Data Back to Client
        const cleanedReviews = data.reviews.map(r => ({
            reviewer: r.reviewer.displayName,
            rating: r.starRating,
            comment: r.comment,
            createTime: r.createTime, // Include necessary fields
        }));

        res.status(200).json({ success: true, reviews: cleanedReviews });

    } catch (error) {
        console.error("Server Error during Google API call:", error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

module.exports = {
    getAccounts,
    getReviews,
};