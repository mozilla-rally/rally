import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useFirebase } from "./FirebaseService";

export async function signupWithEmail(email: string, password: string) {
  const { auth } = useFirebase();

  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await sendEmailVerification(userCredential.user);

  return userCredential;
}