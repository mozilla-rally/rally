// Manual mock required as jest does not handle ESM modules.
module.exports = {
  doc: jest.fn(),
  getDoc: jest.fn(),
  getFirestore: jest.fn(),
  onSnapshot: jest.fn()
};