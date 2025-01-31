module.exports.apiClient = jest.fn(() => ({
  post: jest.fn(() => Promise.resolve({ data: { results: [] } }))
}));
