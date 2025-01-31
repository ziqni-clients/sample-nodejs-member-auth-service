const axios = require('axios');
const post_data_url = process.env.URL;

const apiClient = async (token) => {
  return axios.create({
    baseURL: post_data_url,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

module.exports = { apiClient };
