import { render } from "@testing-library/react";
import { useEffect } from "react";

import {
  LoginState,
  LoginStateProvider,
  useLoginDataContext,
} from "../LoginDataContext";

describe("LoginDataContext tests", () => {
  it("zero state", () => {
    let initalRender = false;

    function Component() {
      const { loginState } = useLoginDataContext();
      expect(loginState).toBe(LoginState.Initial);

      initalRender = true;

      return null;
    }

    render(
      <LoginStateProvider>
        <Component />
      </LoginStateProvider>
    );

    expect(initalRender).toBeTruthy();
  });

  it("login state change", () => {
    let initialRender = false;
    let nextRender = false;

    function Component() {
      const { loginState, setLoginState } = useLoginDataContext();

      useEffect(() => {
        expect(loginState).toBe(LoginState.Initial);
        setLoginState(LoginState.LoginWithEmail);
        initialRender = true;
      }, []);

      useEffect(() => {
        if (loginState === LoginState.LoginWithEmail) {
          nextRender = true;
        }
      }, [loginState]);

      return null;
    }

    render(
      <LoginStateProvider>
        <Component />
      </LoginStateProvider>
    );

    expect(initialRender).toBeTruthy();
    expect(nextRender).toBeTruthy();
  });
});
