import { User } from "../models/User";
import { useFirebase } from "./FirebaseService";
import {
  changeUserEmail,
  changeUserPassword,
  deleteEmailUser,
  deleteGoogleUser,
  loginWithEmail as loginWithEmailFn,
  loginWithGoogle as loginWithGoogleFn,
  logout as logoutFn,
  sendEmailVerification,
  sendPasswordResetEmail as sendPasswordResetEmailFn,
  signupWithEmail as signupWithEmailFn,
} from "./UserAccountService";
import { logEvent } from "firebase/analytics";
import {
  User as FirebaseUser,
  UserCredential,
  onAuthStateChanged,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";

export enum UserType {
  Google = "google",
  Email = "email",
}

export interface UserDataContext {
  changeUserEmail: (email: string, password: string) => Promise<boolean>;
  changeUserPassword: (
    oldPassword: string,
    newPassword: string
  ) => Promise<boolean>;
  deleteGoogleUser: () => Promise<boolean>;
  deleteEmailUser: (password: string) => Promise<boolean>;
  isLoaded: boolean;
  isLoggingIn: boolean;
  isUserVerified: boolean;
  loginWithEmail: (email: string, password: string) => Promise<UserCredential>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  reloadUser: () => Promise<void>;
  sendEmailVerification: () => Promise<void>;
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

// Provides the currently logged in user for non-context caller.
export async function getCurrentUser() {
  const { auth } = useFirebase();

  const user: FirebaseUser | null = await new Promise((resolve) => {
    onAuthStateChanged(auth, (usr) => {
      resolve(usr);
    });
  });

  return user;
}

export function AuthenticationProvider(props: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | undefined>();
  const [isUserVerified, setIsUserVerified] = useState(false);
  const [isLoggingIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const { auth, analytics } = useFirebase();

  function updateUserVerificationState(firebaseUser: FirebaseUser | null) {
    setIsUserVerified(
      Boolean(
        firebaseUser &&
          firebaseUser.providerData &&
          firebaseUser.providerData.length &&
          ((firebaseUser.providerData[0].providerId === "password" &&
            firebaseUser.emailVerified) ||
            firebaseUser.providerData[0].providerId === "google.com")
      )
    );
  }

  useEffect(() => {
    return onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ? { firebaseUser } : undefined);
      updateUserVerificationState(firebaseUser);
      setIsLoaded(true);

      logEvent(
        analytics,
        `sign_${firebaseUser && firebaseUser.uid ? "in" : "out"}`
      );
    });
  }, []);

  return (
    <AuthenticationContext.Provider
      value={{
        user,
        isLoaded,
        isLoggingIn,
        isUserVerified,
        reloadUser: async () => {
          if (!user || !user.firebaseUser) {
            return;
          }
          await user.firebaseUser.reload();
          updateUserVerificationState(user.firebaseUser);
        },
        loginWithEmail: loginWithEmailFn,
        loginWithGoogle: loginWithGoogleFn,
        logout: logoutFn,
        changeUserEmail: async (email: string, password: string) => {
          return await changeUserEmail(
            user && user.firebaseUser,
            email,
            password
          );
        },
        changeUserPassword: async (
          oldPassword: string,
          newPassword: string
        ) => {
          return await changeUserPassword(
            user && user.firebaseUser,
            oldPassword,
            newPassword
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
        sendEmailVerification,
        sendPasswordResetEmail: sendPasswordResetEmailFn,
        signupWithEmail: signupWithEmailFn,
      }}
    >
      {props.children}
    </AuthenticationContext.Provider>
  );
}
