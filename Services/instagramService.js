const axios = require("axios");

async function publishToInstagram(instagramBusinessId, accessToken, imageUrl, caption) {
  try {
    const creationRes = await axios.post(
      `https://graph.facebook.com/v21.0/${instagramBusinessId}/media`,
      null,
      { params: { image_url: imageUrl, caption, access_token: accessToken } }
    );
    const creationId = creationRes.data.id;

    await axios.post(
      `https://graph.facebook.com/v21.0/${instagramBusinessId}/media_publish`,
      null,
      { params: { creation_id: creationId, access_token: accessToken } }
    );

    return { success: true, creationId };
  } catch (err) {
    return { success: false, error: err.response?.data?.error?.message || err.message };
  }
}

module.exports = publishToInstagram;
