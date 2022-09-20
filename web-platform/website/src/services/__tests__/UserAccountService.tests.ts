import { FirebaseError } from "firebase/util";
import {
  EmailAuthProvider,
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  deleteUser,
  fetchSignInMethodsForEmail,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  sendEmailVerification as sendEmailVerificationFn,
  sendPasswordResetEmail as sendPasswordResetEmailFn,
  signInWithEmailAndPassword,
  signInWithRedirect,
  signOut,
} from "firebase/auth";

import { FirebaseErrorCode } from "../../utils/FirebaseErrors";
import { useFirebase } from "../FirebaseService";
import {
  deleteEmailUser,
  deleteGoogleUser,
  loginWithEmail,
  loginWithGoogle,
  logout,
  sendEmailVerification,
  sendPasswordResetEmail,
  signupWithEmail,
} from "../UserAccountService";

jest.mock("firebase/auth");
jest.mock("../FirebaseService");

describe("UserAccountService tests", () => {
  const auth = { test: "test", currentUser: {} };

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

    expect(sendEmailVerificationFn).toHaveBeenCalledWith(userCredential.user);

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

  it("sendEmailVerification throws when auth is null", async () => {
    (useFirebase as jest.Mock).mockReturnValue({ auth: null });

    await expect(
      async () => await sendEmailVerification()
    ).rejects.toThrowError("Invalid user.");

    expect(sendEmailVerificationFn).not.toHaveBeenCalled();
  });

  it("sendEmailVerification throws when current user is null", async () => {
    (useFirebase as jest.Mock).mockReturnValue({ auth: { currentUser: null } });

    await expect(
      async () => await sendEmailVerification()
    ).rejects.toThrowError("Invalid user.");

    expect(sendEmailVerificationFn).not.toHaveBeenCalled();
  });

  it("sendEmailVerification invokes correct firebase functions", async () => {
    await sendEmailVerification();
    expect(sendEmailVerificationFn).toHaveBeenCalledWith(auth.currentUser);
  });

  it("sendPasswordResetEmail invokes correct firebase functions", async () => {
    await sendPasswordResetEmail("joe@doe.com");

    expect(sendPasswordResetEmailFn).toHaveBeenCalledWith(auth, "joe@doe.com");

    expect(useFirebase).toHaveBeenCalled();
  });

  it("deleteGoogleUser returns false when user is not logged in", async () => {
    expect(await deleteGoogleUser(undefined)).toBeFalsy();
  });

  it("deleteGoogleUser returns false when reauthenticateWithPopup returns false", async () => {
    (reauthenticateWithPopup as jest.Mock).mockImplementation(
      async () => false
    );

    const user = {} as User;

    expect(await deleteGoogleUser(user)).toBeFalsy();

    const provider = (GoogleAuthProvider as unknown as jest.Mock).mock
      .instances[0];

    expect(reauthenticateWithPopup).toHaveBeenCalledWith(user, provider);
  });

  it("deleteGoogleUser successfully deletes the user", async () => {
    (reauthenticateWithPopup as jest.Mock).mockImplementation(async () => true);

    const user = {} as User;

    expect(await deleteGoogleUser(user)).toBeTruthy();

    const provider = (GoogleAuthProvider as unknown as jest.Mock).mock
      .instances[0];

    expect(reauthenticateWithPopup).toHaveBeenCalledWith(user, provider);

    expect(deleteUser).toHaveBeenCalledWith(user);
  });

  it("deleteEmailUser returns false when user is not logged in", async () => {
    expect(await deleteEmailUser(undefined, "password")).toBeFalsy();
  });

  it("deleteEmailUser returns false when user does not have an email", async () => {
    expect(await deleteEmailUser({} as User, "password")).toBeFalsy();
  });

  it("deleteEmailUser throws wrong password error when reauthentication fails", async () => {
    (reauthenticateWithCredential as jest.Mock).mockImplementation(async () => {
      throw new Error();
    });

    (EmailAuthProvider.credential as jest.Mock).mockImplementation(
      (email, password) => ({ email, password })
    );

    const email = "foo@doe.com";
    const password = "password";
    const user = { email } as User;

    await expect(
      async () => await deleteEmailUser(user, password)
    ).rejects.toThrowError(
      new FirebaseError(FirebaseErrorCode.WrongPassword, "")
    );

    expect(EmailAuthProvider.credential).toHaveBeenCalledWith(email, password);

    expect(reauthenticateWithCredential).toHaveBeenCalledWith(user, {
      email,
      password,
    });

    expect(deleteUser).not.toHaveBeenCalled();
  });

  it("successfully deletes the email user", async () => {
    (reauthenticateWithCredential as jest.Mock).mockImplementation(async () => {
      return true;
    });

    (EmailAuthProvider.credential as jest.Mock).mockImplementation(
      (email, password) => ({ email, password })
    );

    const email = "foo@doe.com";
    const password = "password";
    const user = { email } as User;

    await expect(deleteEmailUser(user, password)).resolves.toBeTruthy();

    expect(EmailAuthProvider.credential).toHaveBeenCalledWith(email, password);

    expect(reauthenticateWithCredential).toHaveBeenCalledWith(user, {
      email,
      password,
    });

    expect(deleteUser).toHaveBeenCalledWith(user);
  });
});
