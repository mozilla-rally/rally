import { onAuthStateChanged, signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";

import { User } from "../models/User";
import { useFirebase } from "./FirebaseService";
import { signupWithEmail as signupWithEmailFunction } from "./UserAccountService";

export interface UserDataContext {
  isLoaded: boolean;
  user?: User;
  isLoggingIn: boolean;
  isUserVerified: boolean;
  logout: () => Promise<void>;
  signupWithEmail(email: string, password: string): Promise<void>;
}

const AuthenticationContext = createContext<UserDataContext>({
  isLoaded: false,
  user: undefined,
  isLoggingIn: false,
  isUserVerified: false,
} as UserDataContext);

export function useAuthentication() {
  return useContext(AuthenticationContext);
}

export function AuthenticationProvider(props: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | undefined>();
  const [isUserVerified, setIsUserVerified] = useState(false);
  const [isLoggingIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const { auth } = useFirebase();

  useEffect(() => {
    onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ? { firebaseUser } : undefined);
    });

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    setIsUserVerified(
      Boolean(
        user &&
          user.firebaseUser.providerData &&
          user.firebaseUser.providerData.length &&
          ((user.firebaseUser.providerData[0].providerId === "password" &&
            user.firebaseUser.emailVerified) ||
            user.firebaseUser.providerData[0].providerId === "google")
      )
    );
  }, [user]);

  async function logout() {
    signOut(auth);
  }

  async function signupWithEmail(
    email: string,
    password: string
  ): Promise<void> {
    try {
      await signupWithEmailFunction(email, password);
    } catch (e) {
      console.error(`Failed to create account with email. Error: ${e}.`);
      throw e;
    }
  }

  return (
    <AuthenticationContext.Provider
      value={{
        user,
        isLoaded,
        isLoggingIn,
        isUserVerified,
        logout,
        signupWithEmail,
      }}
    >
      {props.children}
    </AuthenticationContext.Provider>
  );
}
