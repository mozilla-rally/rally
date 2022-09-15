import { createContext, useContext, useEffect, useState } from "react";

import { useAuthentication } from "../../../services/AuthenticationService";

export enum LoginState {
  EmailAccountCreated = "EmailAccountCreated",
  Initial = "Initial",
  Login = "Login",
  ResetPassword = "ResetPassword",
  SignupWithGoogle = "SignupWithGoogle",
  SignupWithEmail = "SignupWithEmail",
}

export interface LoginDataContext {
  loginState: LoginState;
  setLoginState(loginState: LoginState): void;
}

const DataContext = createContext<LoginDataContext>({
  loginState: LoginState.Initial,
} as LoginDataContext);

export function useLoginDataContext() {
  return useContext(DataContext);
}

export function LoginStateProvider(props: { children: React.ReactNode }) {
  const { user, isUserVerified, isLoaded } = useAuthentication();

  const [loginState, setLoginStateFn] = useState<LoginState>(
    LoginState.Initial
  );

  useEffect(() => {
    // If user is present but not verified we set initial state to login
    // since login view displays user not verified error.
    if (isLoaded && user && !isUserVerified && !LoginState.EmailAccountCreated) {
      setLoginStateFn(LoginState.Login);
    }
  }, [user, isLoaded, isUserVerified]);

  return (
    <DataContext.Provider
      value={{
        loginState,
        setLoginState: (state) => setLoginStateFn(state),
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
}
