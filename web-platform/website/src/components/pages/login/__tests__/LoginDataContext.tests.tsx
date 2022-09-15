import { render } from "@testing-library/react";
import { useEffect } from "react";

import { useAuthentication } from "../../../../services/AuthenticationService";
import {
  LoginState,
  LoginStateProvider,
  useLoginDataContext,
} from "../LoginDataContext";

jest.mock("../../../../services/AuthenticationService");

describe("LoginDataContext tests", () => {
  it("zero state", () => {
    let initalRender = false;

    (useAuthentication as jest.Mock).mockReturnValue({
      user: undefined,
      isLoaded: true,
      isUserVerified: false,
    });

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

  it("sets state to login for unverified user", () => {
    (useAuthentication as jest.Mock).mockReturnValue({
      user: {},
      isLoaded: true,
      isUserVerified: false,
    });

    let renderCount = 0;

    function Component() {
      const { loginState } = useLoginDataContext();

      useEffect(() => {
        if (renderCount === 0) {
          expect(loginState).toBe(LoginState.Initial);
        } else {
          expect(loginState).toBe(LoginState.Login);
        }

        renderCount++;
      }, [loginState]);

      return null;
    }

    render(
      <LoginStateProvider>
        <Component />
      </LoginStateProvider>
    );

    expect(renderCount).toBe(1);
  });

  it("login state change", () => {
    let initialRender = false;
    let nextRender = false;

    (useAuthentication as jest.Mock).mockReturnValue({
      user: undefined,
      isLoaded: true,
      isUserVerified: false,
    });

    function Component() {
      const { loginState, setLoginState } = useLoginDataContext();

      useEffect(() => {
        expect(loginState).toBe(LoginState.Initial);
        setLoginState(LoginState.SignupWithEmail);
        initialRender = true;
      }, []); // eslint-disable-line react-hooks/exhaustive-deps

      useEffect(() => {
        if (loginState === LoginState.SignupWithEmail) {
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
