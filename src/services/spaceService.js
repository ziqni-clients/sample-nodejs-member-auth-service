const axios = require('axios');
const logger = require('../utils/logger');

/**
 * Fetches the list of allowed spaces from the external API.
 *
 * @param {string} token - Authorization token
 * @returns {Promise<Array>} - List of allowed spaces
 * @throws {Error} - Throws an error if the request fails
 */
const getAllowedSpaces = async (token) => {
  const url = 'https://api.ziqni.com/spaces';

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data.results;
  } catch (error) {
    logger.error('Error fetching allowed spaces: ' + error.code);
    throw new Error(error.message || 'Failed to fetch allowed spaces');
  }
};

module.exports = { getAllowedSpaces };
