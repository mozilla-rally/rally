import { UserCredential, onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";

import { User } from "../models/User";
import { useFirebase } from "./FirebaseService";
import {
  changeUserEmail,
  deleteEmailUser,
  deleteGoogleUser,
  loginWithEmail as loginWithEmailFn,
  loginWithGoogle as loginWithGoogleFn,
  logout as logoutFn,
  sendPasswordResetEmail as sendPasswordResetEmailFn,
  signupWithEmail as signupWithEmailFn,
} from "./UserAccountService";

export enum UserType {
  Google = "google",
  Email = "email",
}

export interface UserDataContext {
  changeUserEmail: (email: string, password: string) => Promise<boolean>;
  deleteGoogleUser: () => Promise<boolean>;
  deleteEmailUser: (password: string) => Promise<boolean>;
  isLoaded: boolean;
  isLoggingIn: boolean;
  isUserVerified: boolean;
  loginWithEmail: (email: string, password: string) => Promise<UserCredential>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  signupWithEmail(email: string, password: string): Promise<UserCredential>;
  sendPasswordResetEmail(email: string): Promise<void>;
  user?: User;
  userType: UserType | null;
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
        sendPasswordResetEmail: sendPasswordResetEmailFn,
        signupWithEmail: signupWithEmailFn,
        changeUserEmail: async (email: string, password: string) => {
          return await changeUserEmail(
            user && user.firebaseUser,
            email,
            password
          );
        },
        deleteGoogleUser: async () => {
          return await deleteGoogleUser(user && user.firebaseUser);
        },
        deleteEmailUser: async (password: string) => {
          return await deleteEmailUser(user && user.firebaseUser, password);
        },
        get userType() {
          if (!user || !user.firebaseUser) {
            return null;
          }

          const isGoogleAccount =
            (user.firebaseUser.providerData &&
              user.firebaseUser.providerData.length &&
              user.firebaseUser.providerData[0].providerId &&
              user.firebaseUser.providerData[0].providerId
                .toLocaleLowerCase()
                .includes("google")) ||
            false;

          return isGoogleAccount ? UserType.Google : UserType.Email;
        },
      }}
    >
      {props.children}
    </AuthenticationContext.Provider>
  );
}
