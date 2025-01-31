const { generateSessionToken } = require('./generateSessionToken');
const { apiClient } = require('../utils/apiClient');
const logger = require('../utils/logger');

/**
 * Fetches active competitions along with their associated contests.
 * @param {string} memberRefId - The reference ID of the member.
 * @param {string} space - The space where competitions are located.
 * @param {string} token - The authentication token.
 * @param {string} apiKey - The API key for authentication.
 * @returns {Promise<{sessionToken: string, competitions: Array}>}
 */
async function getActiveCompetitions(memberRefId, space, token, apiKey) {
  try {
    logger.info(`Fetching active competitions for memberRefId: ${memberRefId}, space: ${space}`);

    const sessionTokenResponse = await generateSessionToken(
      memberRefId,
      apiKey
    );

    if (sessionTokenResponse.status !== 200) {
      return { error: sessionTokenResponse.error || 'Failed to generate session token.' };
    }

    const api = await apiClient(token);

    const competitionsUrl = `/competitions/query`;
    const contestsUrl = `/contests/query`;

    // Fetch active competitions
    logger.info('Fetching active competitions...');
    const competitionsResponse = await api.post(competitionsUrl, {
      must: [
        {
          queryField: 'status',
          queryValues: ['Active'],
        },
      ],
      sortBy: [
        {
          queryField: 'created',
          order: 'Desc',
        },
      ],
      limit: 10,
      skip: 0,
    });

    const competitions = competitionsResponse.data.results || [];
    logger.info(`Found ${competitions.length} active competitions.`);

    // Fetch contests for each competition
    logger.info('Fetching contests for each competition...');
    const competitionsWithContests = await Promise.all(
      competitions.map(async (competition) => {
        const contestsResponse = await api.post(contestsUrl, {
          must: [
            {
              queryField: 'competitionId',
              queryValues: [competition.id],
            },
          ],
          sortBy: [
            {
              queryField: 'created',
              order: 'Desc',
            },
          ],
          limit: 10,
          skip: 0,
        });

        const contests = contestsResponse.data.results || [];
        logger.info(`Found ${contests.length} contests for competition ${competition.id}.`);

        return {
          competitionId: competition.id,
          name: competition.name,
          startDate: competition.scheduledStartDate,
          endDate: competition.scheduledEndDate,
          status: competition.status,
          contests,
        };
      })
    );

    logger.info('Fetched active competitions and contests successfully.');
    return {
      sessionToken: sessionTokenResponse.token,
      competitions: competitionsWithContests,
    };
  } catch (error) {
    logger.error('Error fetching competitions:', error);
    return { error: 'Failed to fetch competitions.' };
  }
}

module.exports = { getActiveCompetitions };
