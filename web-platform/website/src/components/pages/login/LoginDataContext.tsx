import { createContext, useContext, useState } from "react";

export enum LoginState {
  Initial = "Initial",
  SignupWithGoogle = "SignupWithGoogle",
  SignupWithEmail = "SignupWithEmail",
  EmailAccountCreated = "EmailAccountCreated",
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
  const [loginState, setLoginStateFn] = useState<LoginState>(
    LoginState.Initial
  );

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
