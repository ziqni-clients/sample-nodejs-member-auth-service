const axios = require('axios');
const { apiClient } = require('../utils/apiClient');

async function generateSessionToken(memberRefId, apiKey) {
  if (!memberRefId || typeof memberRefId !== 'string') {
    console.error('Invalid or missing "memberRefId". It must be a string.');
    return {
      status: 400,
      error: 'Invalid or missing "memberRefId". It must be a string.',
    };
  }

  if (!apiKey || typeof apiKey !== 'string') {
    console.error('Invalid or missing "apiKey". It must be a string.');
    return {
      status: 400,
      error: 'Invalid or missing "apiKey". It must be a string.',
    };
  }

  try {
    const response = await axios.post('https://api.ziqni.com/member-token', {
      member: memberRefId,
      apiKey: apiKey,
      isReferenceId: true,
      expires: 1800,
      resource: 'ziqni-gapi',
    });

    return { status: 200, token: response.data.data.jwtToken };
  } catch (error) {
    console.error(
      'Error generating session token:',
      error.response?.data || error.message
    );
    return {
      status: 500,
      error: 'Failed to generate session token.',
    };
  }
}

async function getActiveCompetitions(memberRefId, space, token, apiKey) {
  try {
    const sessionTokenResponse = await generateSessionToken(
      memberRefId,
      apiKey
    );
    const api = await apiClient(token);

    const competitionsUrl = `/competitions/query`;
    const contestsUrl = `/contests/query`;

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

        return {
          competitionId: competition.id,
          name: competition.name,
          startDate: competition.scheduledStartDate,
          endDate: competition.scheduledEndDate,
          status: competition.status.toLowerCase(),
          contests,
        };
      })
    );

    return {
      sessionToken: sessionTokenResponse.token,
      competitions: competitionsWithContests,
    };
  } catch (error) {
    console.error('Error fetching competitions:', error);
    return res.status(500).json({ error: 'Failed to fetch competitions.' });
  }
}

module.exports = { getActiveCompetitions };
