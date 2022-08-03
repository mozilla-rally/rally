// Manual mock required as jest does not handle ESM modules.
module.exports = {
  EmailAuthProvider: {
    credential: jest.fn()
  },
  GoogleAuthProvider: jest.fn(),
  User: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  deleteUser: jest.fn(),
  fetchSignInMethodsForEmail: jest.fn(),
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
  reauthenticateWithCredential: jest.fn(),
  reauthenticateWithPopup: jest.fn(),
  sendEmailVerification: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signInWithRedirect: jest.fn(),
  signOut: jest.fn()
};