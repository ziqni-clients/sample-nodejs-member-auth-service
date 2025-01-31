const validateParams = require('../../src/middlewares/validationMiddleware');
const { getAllowedSpaces } = require('../../src/services/spaceService');
jest.mock('../../src/services/spaceService'); // Mocking an external service for testing

describe('validateParams', () => {
  it('should return 400 if memberRefId is missing', async () => {
    const req = { query: { space: 'testSpace' }, rawHeaders: ['Authorization'] };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await validateParams(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or missing "memberRefId". It must be a string.' });
  });

  it('should call next if parameters are valid', async () => {
    const req = { query: { memberRefId: '123', space: 'testSpace' }, rawHeaders: ['Authorization'] };
    const res = {};
    const next = jest.fn();

    getAllowedSpaces.mockResolvedValue([{ spaceName: 'testSpace' }]);

    await validateParams(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
