import { FirebaseError } from "@firebase/util";
import {
  EmailAuthProvider,
  GoogleAuthProvider,
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  deleteUser,
  fetchSignInMethodsForEmail,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail as sendPasswordResetEmailFn,
  signInWithEmailAndPassword,
  signInWithRedirect,
  signOut,
  updateEmail,
  updatePassword,
} from "firebase/auth";

import { FirebaseErrorCode } from "../utils/FirebaseErrors";
import { useFirebase } from "./FirebaseService";

export async function loginWithEmail(
  email: string,
  password: string
): Promise<UserCredential> {
  const { auth } = useFirebase();
  const signInMethods = await fetchSignInMethodsForEmail(auth, email);

  if (
    signInMethods &&
    signInMethods.includes("google.com") &&
    !signInMethods.includes("password")
  ) {
    throw new Error("google-only-account");
  }

  return await signInWithEmailAndPassword(auth, email, password);
}

export async function loginWithGoogle(): Promise<void> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  const { auth } = useFirebase();
  await signInWithRedirect(auth, provider);
}

export async function logout() {
  const { auth } = useFirebase();
  await signOut(auth);
}

export async function sendPasswordResetEmail(email: string): Promise<void> {
  const { auth } = useFirebase();
  await sendPasswordResetEmailFn(auth, email);
}

export async function signupWithEmail(
  email: string,
  password: string
): Promise<UserCredential> {
  const { auth } = useFirebase();

  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await sendEmailVerification(userCredential.user);

  return userCredential;
}

export async function deleteGoogleUser(user?: User): Promise<boolean> {
  if (!user) {
    return false;
  }

  const provider = new GoogleAuthProvider();

  if (!(await reauthenticateWithPopup(user, provider))) {
    return false;
  }

  await deleteUser(user);
  return true;
}

export async function changeUserEmail(
  user: User | undefined,
  email: string,
  password: string,
): Promise<boolean> {
  if (!user || !user.email) {
    return false;
  }

  try {
    if (user.email === email) throw new Error("email-is-current-email");
    if (
      !(await reauthenticateWithCredential(
        user,
        EmailAuthProvider.credential(user.email, password)
      ))
    ) {
      return false;
    }
  } catch (e) {
    throw new FirebaseError(FirebaseErrorCode.WrongPassword, "");
  }

  await updateEmail(user, email);
  console.info("email changed!");
  if (!user.emailVerified) {
    console.info("user not verified!");
    await sendEmailVerification(user);
  } else {
    console.info("email verified!");
  }
  return true;
}

export async function deleteEmailUser(
  user: User | undefined,
  password: string
): Promise<boolean> {
  if (!user || !user.email) {
    return false;
  }

  try {
    if (
      !(await reauthenticateWithCredential(
        user,
        EmailAuthProvider.credential(user.email, password)
      ))
    ) {
      return false;
    }
  } catch (e) {
    throw new FirebaseError(FirebaseErrorCode.WrongPassword, "");
  }

  await deleteUser(user);
  return true;
}
