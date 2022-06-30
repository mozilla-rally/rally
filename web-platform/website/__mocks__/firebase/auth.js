// Manual mock required as jest does not handle ESM modules.
module.exports = {
  GoogleAuthProvider: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  fetchSignInMethodsForEmail: jest.fn(),
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
  sendEmailVerification: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signInWithRedirect: jest.fn(),
  signOut: jest.fn()
};