const { getAllowedSpaces } = require('../services/spaceService');

/**
 * Middleware to validate request parameters.
 * Ensures `memberRefId` and `space` are provided and checks if the space is allowed.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const validateParams = async (req, res, next) => {
  const { memberRefId, space } = req.query; // GET request parameters
  const token = req.rawHeaders[1]; // Token from previous middleware

  if (!memberRefId || typeof memberRefId !== 'string') {
    return res.status(400).json({
      error: 'Invalid or missing "memberRefId". It must be a string.',
    });
  }

  if (!space || typeof space !== 'string') {
    return res
      .status(400)
      .json({ error: 'Invalid or missing "space". It must be a string.' });
  }

  try {
    // Fetch allowed spaces using the provided token
    const allowedSpaces = await getAllowedSpaces(token);

    const isSpaceAllowed = allowedSpaces.some(
      (allowedSpace) => allowedSpace.spaceName === space
    );

    if (!isSpaceAllowed) {
      return res.status(400).json({
        error: `"space" must be one of the following: ${allowedSpaces
          .map((allowedSpace) => allowedSpace.spaceName)
          .join(', ')}.`,
      });
    }

    next();
  } catch (error) {
    console.error('Validation error:', error);
    return res.status(error.status || 500).json({
      error: error,
    });
  }
};

module.exports = validateParams;
