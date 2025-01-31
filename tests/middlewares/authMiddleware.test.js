const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const extractTokenAndApiKey = require('../../src/middlewares/authMiddleware');
const logger = require('../../src/utils/logger');

// We mock the logger for tests so as not to clog the console
jest.mock('../../src/utils/logger');

const app = express();
app.use(express.json());

// Using the middleware in the application
app.use(extractTokenAndApiKey);

app.get('/test', (req, res) => {
  res.status(200).json({ success: 'Valid token and API key' });
});

describe('extractTokenAndApiKey Middleware', () => {
  it('should return 401 if token or API key is missing', async () => {
    const response = await request(app).get('/test');

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Missing token or API key');
    expect(logger.error).toHaveBeenCalledWith('Missing token or API key');
  });

  it('should return 401 if token format is invalid', async () => {
    const response = await request(app)
      .get('/test')
      .set('Authorization', 'invalid_token')
      .set('x-api-key', 'valid_api_key');

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Invalid token format');
    expect(logger.error).toHaveBeenCalledWith('Invalid token format');
  });

  it('should return 401 if token is expired', async () => {
    // Create an expired token
    const expiredToken = jwt.sign(
      { exp: Math.floor(Date.now() / 1000) - 1000 }, // token has expired
      'secret'
    );

    const response = await request(app)
      .get('/test')
      .set('Authorization', expiredToken)
      .set('x-api-key', 'valid_api_key');

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Unauthorized: Invalid or expired token');
    expect(logger.error).toHaveBeenCalledWith('Token has expired');
  });

  it('should proceed to next middleware if token is valid', async () => {
    const validToken = jwt.sign({ exp: Math.floor(Date.now() / 1000) + 1000 }, 'secret'); // the token is still valid

    const response = await request(app)
      .get('/test')
      .set('Authorization', validToken)
      .set('x-api-key', 'valid_api_key');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe('Valid token and API key');
  });
});
