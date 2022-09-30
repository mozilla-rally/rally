import { render } from "@testing-library/react";

import { EmailSignupView } from "../EmailSignupView";
import { InitialLoginView } from "../InitialLoginView";
import {
  LoginState,
  LoginStateProvider,
  useLoginDataContext,
} from "../LoginDataContext";
import { LoginPageContent } from "../LoginPageContent";
import { LoginView } from "../LoginView";
import { ResetPasswordView } from "../ResetPasswordView";

jest.mock("../EmailSignupView");
jest.mock("../InitialLoginView");
jest.mock("../LoginDataContext");
jest.mock("../LoginView");
jest.mock("../ResetPasswordView");

describe("LoginPageContent tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();
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
    render(<LoginPageContent />);

    expect(useLoginDataContext).toHaveBeenCalled();
    expect(InitialLoginView).toHaveBeenCalled();
  });

  it("renders email signup view", () => {
    (useLoginDataContext as jest.Mock).mockClear().mockImplementation(() => ({
      loginState: LoginState.SignupWithEmail,
    }));

    render(<LoginPageContent />);

    expect(useLoginDataContext).toHaveBeenCalled();
    expect(EmailSignupView).toHaveBeenCalled();
  });

  it("renders login view", () => {
    (useLoginDataContext as jest.Mock).mockImplementation(() => ({
      loginState: LoginState.Login,
    }));

    render(<LoginPageContent />);

    expect(LoginView).toHaveBeenCalled();
  });

  it("renders reset password view", () => {
    (useLoginDataContext as jest.Mock).mockImplementation(() => ({
      loginState: LoginState.ResetPassword,
    }));

    render(<LoginPageContent />);

    expect(ResetPasswordView).toHaveBeenCalled();
  });

  it("throws when loginState is invalid", () => {
    (useLoginDataContext as jest.Mock).mockReset().mockImplementation(() => ({
      loginState: undefined,
    }));

    jest.spyOn(console, "error").mockImplementation(() => {}); //eslint-disable-line @typescript-eslint/no-empty-function

    expect(() => render(<LoginPageContent />)).toThrowError(
      "Invalid card type."
    );
  });
});
