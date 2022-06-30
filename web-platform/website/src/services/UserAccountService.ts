import {
  GoogleAuthProvider,
  UserCredential,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  sendEmailVerification,
  sendPasswordResetEmail as sendPasswordResetEmailFn,
  signInWithEmailAndPassword,
  signInWithRedirect,
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
