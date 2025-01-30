const { getAllowedSpaces } = require('../services/spaceService');
const logger = require('../utils/logger');

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

  logger.info(`Incoming request: memberRefId=${memberRefId}, space=${space}`);

  if (!memberRefId || typeof memberRefId !== 'string') {
    logger.error(`Invalid or missing "memberRefId": ${memberRefId}`);
    return res.status(400).json({
      error: 'Invalid or missing "memberRefId". It must be a string.',
    });
  }

  if (!space || typeof space !== 'string') {
    logger.error(`Invalid or missing "space": ${space}`);
    return res
      .status(400)
      .json({ error: 'Invalid or missing "space". It must be a string.' });
  }

  try {
    // Fetch allowed spaces using the provided token
    logger.info('Fetching allowed spaces...');
    const allowedSpaces = await getAllowedSpaces(token) || [];

    if (!Array.isArray(allowedSpaces) || allowedSpaces.length === 0) {
      logger.warn('Allowed spaces list is empty or invalid.');
      return res.status(500).json({ error: 'Failed to retrieve allowed spaces' });
    }

    const allowedSpaceNames = allowedSpaces.map((allowedSpace) => allowedSpace.spaceName).join(', ');

    const isSpaceAllowed = allowedSpaces.some(
      (allowedSpace) => allowedSpace.spaceName === space
    );

    if (!isSpaceAllowed) {
      logger.warn(`Space "${space}" is not allowed. Allowed spaces: ${allowedSpaceNames}`);
      return res.status(400).json({
        error: `"space" must be one of the following: ${allowedSpaceNames}.`,
      });
    }

    logger.info('Space validation passed. Proceeding to next middleware.');
    next();
  } catch (error) {
    logger.error('Error occurred during validation:', error);
    return res.status(error.status || 500).json({
      error: error.message || 'Internal Server Error',
    });
  }
};

module.exports = validateParams;
