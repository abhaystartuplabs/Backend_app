const axios = require("axios");

const publishToInstagram = async (instagramBusinessId, accessToken, imageUrl, caption) => {
    try {
        console.log("1️⃣ Creating Instagram Media Container...");
        const containerRes = await axios.post(
            `https://graph.facebook.com/v21.0/${instagramBusinessId}/media`,
            null,
            { params: { image_url: imageUrl, caption, access_token: accessToken } }
        );

        const creationId = containerRes.data.id;
        console.log("   → creation_id:", creationId);

        console.log("2️⃣ Publishing Instagram Media...");
        await axios.post(
            `https://graph.facebook.com/v21.0/${instagramBusinessId}/media_publish`,
            null,
            { params: { creation_id: creationId, access_token: accessToken } }
        );

        return { success: true, creationId };
    } catch (err) {
        console.log("❌ Instagram API Error:", err.response?.data || err.message);

        return {
            success: false,
            error: err.response?.data?.error?.message || "Instagram publish failed"
        };
    }
};

module.exports = publishToInstagram;
