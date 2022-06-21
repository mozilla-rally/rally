import { act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserEvent } from "@testing-library/user-event/dist/types/setup";

import { Strings } from "../../../../resources/Strings";
import { Highlighter } from "../../../Highlighter";
import { EmailSignupView } from "../EmailSignupView";
import { LoginButton } from "../LoginButton";
import {
  LoginFormValidationResult,
  validateLoginForm,
} from "../LoginFormValidator";
import { PasswordRuleViolations } from "../PasswordRuleViolations";
import { PrivacyNoticeAndLoginLink } from "../PrivacyNoticeAndLoginLink";

jest.mock("../../../Highlighter");
jest.mock("../LoginButton");
jest.mock("../LoginFormValidator");
jest.mock("../PasswordRuleViolations");
jest.mock("../PrivacyNoticeAndLoginLink");

const strings = Strings.components.pages.login.emailSignupView;

describe("EmailSignupView tests", () => {
  beforeEach(() => {
    (Highlighter as jest.Mock).mockImplementation(({ children }) => children);
    (LoginButton as jest.Mock).mockImplementation(() => null);
    (PasswordRuleViolations as jest.Mock).mockImplementation(() => null);
    (PrivacyNoticeAndLoginLink as jest.Mock).mockImplementation(() => null);
  });

  it("zero state", () => {
    const root = render(<EmailSignupView />);

    expect(Highlighter).toHaveBeenCalled();
    expect(root.getByText(strings.title)).toBeInTheDocument();

    expect(root.getByText(strings.email)).toBeInTheDocument();
    expect(document.querySelector("input#email")).toBeInTheDocument();
    expect(document.querySelector(".email-error")).not.toBeInTheDocument();

    expect(root.getByText(strings.password)).toBeInTheDocument();
    expect(document.querySelector("input#password")).toBeInTheDocument();
    expect(document.querySelector(".password-error")).not.toBeInTheDocument();

    expect(PasswordRuleViolations).toHaveBeenCalledWith(
      {
        className: "mt-3",
        validationResult: undefined,
      },
      {}
    );

    expect(LoginButton).toHaveBeenCalled();
    expect(PrivacyNoticeAndLoginLink).toHaveBeenCalled();

    expect(validateLoginForm).not.toHaveBeenCalled();

    assertEmailError(undefined);
    assertPasswordError(undefined);
  });

  it("displays error for email and password when validation fails", async () => {
    const passwordRules =
      Strings.components.pages.login.loginFormValidators.passwordRules;

    const validationResult: LoginFormValidationResult = {
      email: {
        error: "Email error",
      },
      password: {
        error: "Password error",
      },
      passwordRules: [
        { title: passwordRules.minLength, valid: false },
        { title: passwordRules.containsLowercase, valid: false },
        { title: passwordRules.containsUppercase, valid: false },
        { title: passwordRules.containsDigit, valid: false },
      ],
      valid: false,
    };

    (validateLoginForm as jest.Mock).mockImplementation(() => validationResult);

    const user = userEvent.setup();

    render(<EmailSignupView />);

    await setEmail(user, "email");
    await setPassword(user, "password");

    login();

    expect(validateLoginForm).toHaveBeenCalledWith("email", "password");

    assertEmailError(validationResult.email.error);
    assertPasswordError(validationResult.password.error);

    expect(PasswordRuleViolations).toHaveBeenCalledWith(
      {
        className: "mt-3",
        validationResult,
      },
      {}
    );

    expect(PrivacyNoticeAndLoginLink).toHaveBeenCalled();
  });

  async function setEmail(userEvent: UserEvent, email: string) {
    const emailTextBox = document.querySelector("input#email") as Element;

    expect(emailTextBox).toBeInTheDocument();

    await userEvent.type(emailTextBox, email);
  }

  async function setPassword(userEvent: UserEvent, password: string) {
    const passwordTextBox = document.querySelector("input#password") as Element;

    expect(passwordTextBox).toBeInTheDocument();

    await userEvent.type(passwordTextBox, password);
  }

  async function login() {
    expect(LoginButton).toHaveBeenCalled();

    const onClick = (LoginButton as jest.Mock).mock.calls[0][0].onClick;

    await act(() => {
      onClick();
    });
  }

  function assertEmailError(emailError?: string | null) {
    const emailErrorElement = document.querySelector(".email-error");

    if (!emailError) {
      expect(emailErrorElement).not.toBeInTheDocument();
      return;
    }

    expect(emailErrorElement).toBeInTheDocument();
    expect(emailErrorElement?.innerHTML).toBe(emailError);
  }

  function assertPasswordError(passwordError?: string | null) {
    const passwordErrorElement = document.querySelector(".password-error");

    if (!passwordError) {
      expect(passwordErrorElement).not.toBeInTheDocument();
      return;
    }

    expect(passwordErrorElement).toBeInTheDocument();
    expect(passwordErrorElement?.innerHTML).toBe(passwordError);
  }
});
