const axios = require('axios');

/**
 * Generates a session token for a given memberRefId and apiKey.
 * @param {string} memberRefId - The reference ID of the member.
 * @param {string} apiKey - The API key for authentication.
 * @returns {Promise<{status: number, token?: string, error?: string}>}
 */
async function generateSessionToken(memberRefId, apiKey) {
  if (!memberRefId || typeof memberRefId !== 'string') {
    return { status: 400, error: 'Invalid or missing "memberRefId".' };
  }

  if (!apiKey || typeof apiKey !== 'string') {
    return { status: 400, error: 'Invalid or missing "apiKey".' };
  }

  try {
    const response = await axios.post('https://api.ziqni.com/member-token', {
      member: memberRefId,
      apiKey: apiKey,
      isReferenceId: true,
      expires: 1800,
      resource: 'ziqni-gapi',
    });

    return { status: 200, token: response.data?.data?.jwtToken };
  } catch (error) {
    return { status: 500, error: 'Failed to generate session token.' };
  }
}

module.exports = { generateSessionToken };
