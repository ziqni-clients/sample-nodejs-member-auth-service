const axios = require('axios');
const { generateSessionToken } = require('../../src/services/generateSessionToken');

jest.mock('axios');

describe('generateSessionToken', () => {
  const memberRefId = 'testMember';
  const apiKey = 'testApiKey';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a session token when API call is successful', async () => {
    axios.post.mockResolvedValue({
      data: {
        data: {
          jwtToken: 'mockToken',
        },
      },
    });

    const response = await generateSessionToken(memberRefId, apiKey);

    expect(response).toEqual({ status: 200, token: 'mockToken' });
    expect(axios.post).toHaveBeenCalledWith('https://api.ziqni.com/member-token', {
      member: memberRefId,
      apiKey,
      isReferenceId: true,
      expires: 1800,
      resource: 'ziqni-gapi',
    });
  });

  it('should return an error when API call fails', async () => {
    axios.post.mockRejectedValue(new Error('Network error'));

    const response = await generateSessionToken(memberRefId, apiKey);

    expect(response).toEqual({ status: 500, error: 'Failed to generate session token.' });
    expect(axios.post).toHaveBeenCalledTimes(1);
  });

  it('should return an error when memberRefId is missing', async () => {
    const response = await generateSessionToken(null, apiKey);

    expect(response).toEqual({ status: 400, error: 'Invalid or missing "memberRefId".' });
  });

  it('should return an error when apiKey is missing', async () => {
    const response = await generateSessionToken(memberRefId, null);

    expect(response).toEqual({ status: 400, error: 'Invalid or missing "apiKey".' });
  });

  it('should return an error when both parameters are missing', async () => {
    const response = await generateSessionToken(null, null);

    expect(response).toEqual({ status: 400, error: 'Invalid or missing "memberRefId".' });
  });
});
