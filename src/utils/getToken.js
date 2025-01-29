const axios = require('axios');

const username = process.env.USER_NAME;
const password = process.env.PASSWORD;

const getToken = async (space) => {
  const clientId = space ? `${space}.ziqni.app` : 'www.ziqni.app';

  try {
    const { data } = await axios({
      method: 'POST',
      url: 'https://identity.ziqni.com/realms/ziqni/protocol/openid-connect/token',
      data: new URLSearchParams({
        client_id: clientId,
        username,
        password,
        grant_type: 'password',
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    console.log('getToken token', data.access_token);
    const { access_token } = data;

    return access_token;
  } catch (err) {
    console.log('GET ERROR =>', err.response || err.message);
    return res.status(500).json({ error: 'Failed to fetch token' });
  }
};

module.exports = { getToken };
