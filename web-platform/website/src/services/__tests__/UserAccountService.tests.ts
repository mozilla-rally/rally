import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { useFirebase } from "../FirebaseService";
import { loginWithEmail, logout, signupWithEmail } from "../UserAccountService";

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
  });

  it("logout logs the user by invoking firebase method", async () => {
    await logout();
    expect(signOut).toHaveBeenCalledWith(auth);
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
  });
});
