import { render } from "@testing-library/react";

import { EmailSignupView } from "../EmailSignupView";
import { InitialLoginView } from "../InitialLoginView";
import { LoginCardFactory } from "../LoginCardFactory";
import { LoginState, useLoginDataContext } from "../LoginDataContext";
import { LoginView } from "../LoginView";
import { ResetPasswordView } from "../ResetPasswordView";

jest.mock("../EmailSignupView");
jest.mock("../InitialLoginView");
jest.mock("../LoginDataContext");
jest.mock("../LoginView");
jest.mock("../ResetPasswordView");

describe("LoginPageContent tests", () => {
  beforeEach(() => {
    (useLoginDataContext as jest.Mock).mockImplementation(() => ({
      loginState: LoginState.Initial,
    }));
  });

  it("renders initial state correctly", () => {
    render(<LoginCardFactory />);

    expect(useLoginDataContext).toHaveBeenCalled();
    expect(InitialLoginView).toHaveBeenCalled();
  });

  it("renders email signup view", () => {
    (useLoginDataContext as jest.Mock).mockClear().mockImplementation(() => ({
      loginState: LoginState.SignupWithEmail,
    }));

    render(<LoginCardFactory />);

    expect(useLoginDataContext).toHaveBeenCalled();
    expect(EmailSignupView).toHaveBeenCalled();
  });

  it("renders login view", () => {
    (useLoginDataContext as jest.Mock).mockImplementation(() => ({
      loginState: LoginState.Login,
    }));

    render(<LoginCardFactory />);

    expect(LoginView).toHaveBeenCalled();
  });

  it("renders reset password view", () => {
    (useLoginDataContext as jest.Mock).mockImplementation(() => ({
      loginState: LoginState.ResetPassword,
    }));

    render(<LoginCardFactory />);

    expect(ResetPasswordView).toHaveBeenCalled();
  });

  it("throws when loginState is invalid", () => {
    (useLoginDataContext as jest.Mock).mockReset().mockImplementation(() => ({
      loginState: undefined,
    }));

    jest.spyOn(console, "error").mockImplementation(() => {}); //eslint-disable-line @typescript-eslint/no-empty-function

    expect(() => render(<LoginCardFactory />)).toThrowError(
      "Invalid card type."
    );
  });
});
