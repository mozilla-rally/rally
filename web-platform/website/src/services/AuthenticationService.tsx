import { UserCredential, onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";

import { User } from "../models/User";
import { useFirebase } from "./FirebaseService";
import {
  loginWithEmail as loginWithEmailFn,
  loginWithGoogle as loginWithGoogleFn,
  logout as logoutFn,
  signupWithEmail as signupWithEmailFn,
} from "./UserAccountService";

export interface UserDataContext {
  isLoaded: boolean;
  user?: User;
  isLoggingIn: boolean;
  isUserVerified: boolean;
  loginWithEmail: (email: string, password: string) => Promise<UserCredential>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  signupWithEmail(email: string, password: string): Promise<UserCredential>;
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
    return onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ? { firebaseUser } : undefined);
      setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    setIsUserVerified(
      Boolean(
        user &&
          user.firebaseUser.providerData &&
          user.firebaseUser.providerData.length &&
          ((user.firebaseUser.providerData[0].providerId === "password" &&
            user.firebaseUser.emailVerified) ||
            user.firebaseUser.providerData[0].providerId === "google.com")
      )
    );
  }, [user]);

  return (
    <AuthenticationContext.Provider
      value={{
        user,
        isLoaded,
        isLoggingIn,
        isUserVerified,
        loginWithEmail: loginWithEmailFn,
        loginWithGoogle: loginWithGoogleFn,
        logout: logoutFn,
        signupWithEmail: signupWithEmailFn,
      }}
    >
      {props.children}
    </AuthenticationContext.Provider>
  );
}
