const jwt = require('jsonwebtoken');

const extractTokenAndApiKey = (req, res, next) => {
  const token = req.headers['authorization'];
  const apiKey = req.headers['x-api-key'];

  if (!token || !apiKey) {
    return res.status(401).json({ error: 'Missing token or API key' });
  }

  try {
    // Decode the token WITHOUT verifying the signature
    const decoded = jwt.decode(token);

    if (!decoded || !decoded.exp) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    if (decoded.exp < now) {
      return res.status(401).json({ error: 'Token has expired' });
    }

    req.tokenData = decoded; // Saving the decrypted token data
  } catch (error) {
    return res.status(401).json({ error: 'Failed to decode token' });
  }

  req.token = token;
  req.apiKey = apiKey;

  next();
};

module.exports = extractTokenAndApiKey;
