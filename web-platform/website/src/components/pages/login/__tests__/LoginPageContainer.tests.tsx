import { render } from "@testing-library/react";

import { EmailSignupView } from "../EmailSignupView";
import { InitialLoginView } from "../InitialLoginView";
import {
  LoginState,
  LoginStateProvider,
  useLoginDataContext,
} from "../LoginDataContext";
import { LoginPageContainer } from "../LoginPageContainer";

jest.mock("../EmailSignupView");
jest.mock("../InitialLoginView");
jest.mock("../LoginDataContext");

describe("LoginPageContainer tests", () => {
  beforeEach(() => {
    (LoginStateProvider as jest.Mock).mockImplementation(
      (props) => props.children
    );
    (useLoginDataContext as jest.Mock).mockImplementation(() => ({
      loginState: LoginState.Initial,
    }));
    (EmailSignupView as jest.Mock).mockImplementation(() => null);
    (InitialLoginView as jest.Mock).mockImplementation(() => null);
  });

  it("renders initial state correctly", () => {
    render(<LoginPageContainer />);

    expect(useLoginDataContext).toHaveBeenCalled();
    expect(InitialLoginView).toHaveBeenCalled();
  });

  it("renders email login correctly", () => {
    (useLoginDataContext as jest.Mock).mockClear().mockImplementation(() => ({
      loginState: LoginState.SignupWithEmail,
    }));

    render(<LoginPageContainer />);
    expect(useLoginDataContext).toHaveBeenCalled();
    expect(EmailSignupView).toHaveBeenCalled();
  });

  it("throws when loginState is invalid", () => {
    (useLoginDataContext as jest.Mock).mockReset().mockImplementation(() => ({
      loginState: undefined,
    }));

    jest.spyOn(console, "error").mockImplementation(() => {}); //eslint-disable-line @typescript-eslint/no-empty-function

    expect(() => render(<LoginPageContainer />)).toThrowError(
      "Invalid card type."
    );
  });
});
