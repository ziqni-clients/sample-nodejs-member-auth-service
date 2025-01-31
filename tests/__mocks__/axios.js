module.exports = {
  post: jest.fn(() => Promise.resolve({ data: { data: { jwtToken: 'mockToken' } } }))
};
