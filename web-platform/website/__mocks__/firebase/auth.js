// Manual mock required as jest does not handle ESM modules.
module.exports = {
  createUserWithEmailAndPassword: jest.fn(),
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
  sendEmailVerification: jest.fn(),
  signOut: jest.fn()
};