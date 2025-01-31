const NodeCache = require('node-cache');
const { getActiveCompetitions } = require('../services/competitionService');
const logger = require('../utils/logger');

// Initialize cache with a TTL of 1800 seconds (30 minutes) and a check period of 300 seconds (5 minutes)
const cache = new NodeCache({ stdTTL: 1800, checkperiod: 300 });

/**
 * Retrieves active competitions for a member and caches the results.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response with active competitions
 */
const checkCompetitions = async (req, res) => {
  const { memberRefId, space } = req.query;
  const { token, apiKey } = req;

  logger.info(`Request received to check competitions for memberRefId: ${memberRefId}, space: ${space}`);

  if (!memberRefId || !space) {
    logger.warn(`Missing "memberRefId" or "space" parameter in request.`);
    return res
      .status(400)
      .json({ error: 'Missing "memberRefId" or "space" parameter' });
  }

  const cacheKey = `${memberRefId}:${space}`;

  // Check if data is available in cache
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    logger.info('Returning data from cache');
    return res.json(cachedData);
  }

  try {
    logger.info('Data not found in cache. Fetching from service...');
    const { sessionToken, competitions } = await getActiveCompetitions(
      memberRefId,
      space,
      token,
      apiKey
    );

    const responseData = {
      sessionToken,
      competitions,
    };

    // Store the result in cache
    logger.info('Storing fetched data in cache');
    cache.set(cacheKey, responseData);

    logger.info('Returning fetched data to client');
    return res.json(responseData);
  } catch (error) {
    logger.error('Error fetching competitions:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  checkCompetitions,
};
