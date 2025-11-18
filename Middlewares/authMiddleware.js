// middleware/authMiddleware.js

const protect = (req, res, next) => {
  // ✅ 1. Let CORS preflight (OPTIONS) requests pass through
  if (req.method === 'OPTIONS') {
    return next();
  }

  let accessToken;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      accessToken = authHeader.split(' ')[1];
      req.accessToken = accessToken;
      return next();
    } catch (error) {
      console.error("Token processing error:", error);
      return res.status(401).json({ message: 'Not authorized, token failed processing.' });
    }
  }

  // ✅ 2. If no token found
  return res.status(401).json({ message: 'Not authorized, no token provided.' });
};

module.exports = { protect };
