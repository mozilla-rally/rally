// Manual mock required as jest does not handle ESM modules.
module.exports = {
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  getFirestore: jest.fn(),
  onSnapshot: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  Timestamp: {
    now: () => "Current Timestamp"
  }
};