const axios = require('axios');

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
    console.error('Error fetching allowed spaces:', error.code);
    return res.status(error.status || 500).json({
      error: error.code || 'Failed to fetch allowed spaces',
    });
  }
};

module.exports = { getAllowedSpaces };
