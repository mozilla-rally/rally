import { createContext, useContext, useEffect, useState } from "react";
import { User } from "../models/User";

export type UserContextData = {
  isLoaded: boolean;
  user?: User;
  isLoggingIn: boolean;
  logout: () => Promise<void>;
};

const AuthenticationContext = createContext<UserContextData>({
  isLoaded: true,
  user: undefined,
  isLoggingIn: false,
  logout: async () => { },
});

export function useAuthentication() {
  return useContext(AuthenticationContext);
}

export function AuthenticationProvider(props: { children: React.ReactNode; }) {
  const [user, setUser] = useState<User>();
  const [isLoggingIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // TODO: Retrieve user here...
    setIsLoaded(true);
  }, []);

  async function logout() {
    // TODO: Clear user here...
    setUser(undefined);
  }

  return (
    <AuthenticationContext.Provider
      value={{
        user,
        isLoaded,
        isLoggingIn,
        logout
      }}
    >
      {props.children}
    </AuthenticationContext.Provider>
  );
}