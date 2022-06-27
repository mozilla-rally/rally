import {
  UserCredential,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

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

export async function logout() {
  const { auth } = useFirebase();
  await signOut(auth);
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
