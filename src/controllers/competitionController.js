const NodeCache = require('node-cache');
const { getActiveCompetitions } = require('../services/competitionService');

const cache = new NodeCache({ stdTTL: 1800, checkperiod: 300 });

const checkCompetitions = async (req, res) => {
  const { memberRefId, space } = req.query;
  const { token, apiKey } = req;

  if (!memberRefId || !space) {
    return res
      .status(400)
      .json({ error: 'Missing "memberRefId" or "space" parameter' });
  }

  const cacheKey = `${memberRefId}:${space}`;

  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log('Returning data from cache');
    return res.json(cachedData);
  }

  try {
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

    cache.set(cacheKey, responseData);

    return res.json(responseData);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  checkCompetitions,
};
