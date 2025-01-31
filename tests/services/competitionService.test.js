const { getActiveCompetitions } = require('../../src/services/competitionService');
const { generateSessionToken } = require('../../src/services/generateSessionToken');
const { apiClient } = require('../../src/utils/apiClient');

jest.mock('../../src/utils/apiClient');
jest.mock('axios');

jest.mock('../../src/services/generateSessionToken', () => ({
  generateSessionToken: jest.fn(),
}));

describe('getActiveCompetitions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return competitions data with session token', async () => {
    // Mock the response from generateSessionToken for this test
    generateSessionToken.mockResolvedValue({
      status: 200,
      token: 'mockToken',
    });

    // Mock apiClient and its response
    apiClient.mockReturnValue({
      post: jest.fn().mockResolvedValue({
        data: { results: [{ id: 1, name: 'Test Competition' }] }
      })
    });

    const response = await getActiveCompetitions('member1', 'space1', 'mockToken', 'apiKey');

    // Checks for data that should be returned
    expect(response).toBeDefined();
    expect(response.sessionToken).toBe('mockToken');
    expect(response.competitions).toHaveLength(1);
    expect(response.competitions[0].name).toBe('Test Competition');
  });

  it('should handle errors gracefully', async () => {
    // Mock the error from generateSessionToken for this test
    generateSessionToken.mockResolvedValueOnce({
      status: 500,
      error: 'Failed to generate session token.',
    });

    const response = await getActiveCompetitions('member1', 'space1', 'mockToken', 'apiKey');

    expect(response).toBeDefined();
    expect(response.error).toBe('Failed to generate session token.');
  });
});
