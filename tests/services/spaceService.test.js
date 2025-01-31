const axios = require('axios');
const { getAllowedSpaces } = require('../../src/services/spaceService');

jest.mock('axios', () => ({
  get: jest.fn(), // Explicitly mocking axios.get
}));

describe('getAllowedSpaces', () => {
  const mockToken = 'test-token';

  afterEach(() => {
    jest.clearAllMocks(); // Clean the mocks after each test
  });

  it('should return allowed spaces when API responds successfully', async () => {
    const mockResponse = { data: { results: [{ spaceName: 'Space1' }, { spaceName: 'Space2' }] } };
    axios.get.mockResolvedValue(mockResponse); // Mocking a successful response

    const result = await getAllowedSpaces(mockToken);

    expect(axios.get).toHaveBeenCalledWith('https://api.ziqni.com/spaces', {
      headers: {
        Authorization: `Bearer ${mockToken}`,
        'Content-Type': 'application/json',
      },
    });
    expect(result).toEqual(mockResponse.data.results);
  });

  it('should throw an error when API request fails', async () => {
    axios.get.mockRejectedValue(new Error('Network Error')); // Mocking the request error

    await expect(getAllowedSpaces(mockToken)).rejects.toThrow('Network Error');
  });

  it('should throw a default error message if API error has no message', async () => {
    axios.get.mockRejectedValue({}); // Mocking the error without message

    await expect(getAllowedSpaces(mockToken)).rejects.toThrow('Failed to fetch allowed spaces');
  });
});
