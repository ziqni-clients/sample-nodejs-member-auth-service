const request = require('supertest');
const express = require('express');
const { checkCompetitions } = require('../../src/controllers/competitionController');
const NodeCache = require('node-cache');
const competitionService = require('../../src/services/competitionService');

// Mocking the cache
jest.mock('node-cache');
jest.mock('../../src/services/competitionService');

const app = express();
app.get('/competitions', checkCompetitions);

describe('GET /competitions', () => {
  beforeEach(() => {
    // Clear mocks and cache before each test
    NodeCache.prototype.get.mockReset();
    competitionService.getActiveCompetitions.mockReset();
  });

  it('should return competitions from cache', async () => {
    const mockData = { sessionToken: 'mockToken', competitions: [] };

    // Mock cache behavior
    NodeCache.prototype.get.mockReturnValueOnce(mockData);

    const response = await request(app).get('/competitions?memberRefId=member1&space=space1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockData);
  });

  it('should fetch competitions from service if not in cache', async () => {
    const mockData = { sessionToken: 'mockToken', competitions: [] };
    NodeCache.prototype.get.mockReturnValueOnce(null); // Cache is empty

    // Mocking the service to receive data
    competitionService.getActiveCompetitions.mockResolvedValueOnce(mockData);

    const response = await request(app).get('/competitions?memberRefId=member1&space=space1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockData);
  });

  it('should return 400 if memberRefId or space is missing', async () => {
    const response = await request(app).get('/competitions');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Missing "memberRefId" or "space" parameter');
  });
});
