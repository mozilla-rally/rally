import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithRedirect,
  signOut,
} from "firebase/auth";

import { useFirebase } from "../FirebaseService";
import {
  loginWithEmail,
  loginWithGoogle,
  logout,
  signupWithEmail,
} from "../UserAccountService";

jest.mock("firebase/auth");
jest.mock("../FirebaseService");

describe("UserAccountService tests", () => {
  const auth = { test: "test" };

  beforeEach(() => {
    jest.resetAllMocks();
    (useFirebase as jest.Mock).mockImplementation(() => ({ auth }));
  });

  it("signupWithEmail correctly creates user account", async () => {
    const userCredential = { user: "test user" };

    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue(
      userCredential
    );

    await expect(signupWithEmail("email", "password")).resolves.toBe(
      userCredential
    );

    expect(sendEmailVerification).toHaveBeenCalledWith(userCredential.user);

    expect(useFirebase).toHaveBeenCalled();
  });

  it("logout logs the user by invoking firebase method", async () => {
    await logout();
    expect(signOut).toHaveBeenCalledWith(auth);
    expect(useFirebase).toHaveBeenCalled();
  });

  it("login with email throws when email is registered via google login", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {}); //eslint-disable-line @typescript-eslint/no-empty-function

    (fetchSignInMethodsForEmail as jest.Mock).mockImplementation(
      () => "google.com"
    );

    expect(async () =>
      loginWithEmail("email", "password")
    ).rejects.toThrowError("google-only-account");

    expect(fetchSignInMethodsForEmail).toHaveBeenCalledWith(auth, "email");
    expect(signInWithEmailAndPassword).not.toHaveBeenCalled();
    expect(useFirebase).toHaveBeenCalled();
  });

  it("login works fine when email is registed by both google and password", async () => {
    (fetchSignInMethodsForEmail as jest.Mock).mockImplementation(
      () => "google.com password"
    );

    (signInWithEmailAndPassword as jest.Mock).mockImplementation(
      () => "Credentials"
    );

    expect(await loginWithEmail("email", "password")).toBe("Credentials");

    expect(fetchSignInMethodsForEmail).toHaveBeenCalledWith(auth, "email");

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      auth,
      "email",
      "password"
    );

    expect(useFirebase).toHaveBeenCalled();
  });

  it("login works fine when email is registed only by password", async () => {
    (fetchSignInMethodsForEmail as jest.Mock).mockImplementation(
      () => "password"
    );

    (signInWithEmailAndPassword as jest.Mock).mockImplementation(
      () => "Credentials"
    );

    expect(await loginWithEmail("email", "password")).toBe("Credentials");

    expect(fetchSignInMethodsForEmail).toHaveBeenCalledWith(auth, "email");

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      auth,
      "email",
      "password"
    );

    expect(useFirebase).toHaveBeenCalled();
  });

  it("login with google invokes correct firebase functions", async () => {
    const setCustomParameters = jest.fn();

    GoogleAuthProvider.prototype.setCustomParameters = setCustomParameters;

    await loginWithGoogle();

    expect(setCustomParameters).toHaveBeenCalledWith({
      prompt: "select_account",
    });

    const instance = (GoogleAuthProvider as unknown as jest.Mock).mock
      .instances[0];

    expect(signInWithRedirect).toHaveBeenCalledWith(auth, instance);

    expect(useFirebase).toHaveBeenCalled();
  });
});
