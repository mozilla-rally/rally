// Manual mock required as jest does not handle ESM modules.
module.exports = {
  connectFunctionsEmulator: jest.fn(),
  getFunctions: jest.fn()
};