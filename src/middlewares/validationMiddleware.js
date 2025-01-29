const { getAllowedSpaces } = require('../services/spaceService');

const validateParams = async (req, res, next) => {
  const { memberRefId, space } = req.query; // get
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
