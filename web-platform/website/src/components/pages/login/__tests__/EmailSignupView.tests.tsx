import { RenderResult, act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserEvent } from "@testing-library/user-event/dist/types/setup";

import { Flags } from "../../../../resources/Flags";
import { Strings } from "../../../../resources/Strings";
import { useAuthentication } from "../../../../services/AuthenticationService";
import { useFlagService } from "../../../../services/FlagService";
import { useStudies } from "../../../../services/StudiesService";
import { getFirebaseErrorMessage } from "../../../../utils/FirebaseErrors";
import { Highlighter } from "../../../Highlighter";
import { EmailSignupView } from "../EmailSignupView";
import { LoginButton } from "../LoginButton";
import {
  LoginFormValidationResult,
  validateLoginForm,
  validatePasswordRules,
} from "../LoginFormValidator";
import { PasswordRules } from "../PasswordRules";
import { PrivacyNoticeAndLoginLink } from "../PrivacyNoticeAndLoginLink";

jest.mock("../../../../services/AuthenticationService");
jest.mock("../../../../services/FlagService");
jest.mock("../../../../services/StudiesService");
jest.mock("../../../../utils/FirebaseErrors");
jest.mock("../../../Highlighter");
jest.mock("../LoginButton");
jest.mock("../LoginFormValidator");
jest.mock("../PasswordRules");
jest.mock("../PrivacyNoticeAndLoginLink");

const strings = Strings.components.pages.login.emailSignupView;

describe("EmailSignupView tests", () => {
  const signupWithEmail = jest.fn();
  const isFlagActive = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    (useFlagService as jest.Mock).mockReturnValue({
      isFlagActive,
    });

    (Highlighter as jest.Mock).mockImplementation(({ children }) => children);
    (LoginButton as jest.Mock).mockImplementation(({ children }) => children);
    (PasswordRules as jest.Mock).mockImplementation(() => null);
    (PrivacyNoticeAndLoginLink as jest.Mock).mockImplementation(() => null);

    (useAuthentication as jest.Mock).mockReturnValue({
      signupWithEmail,
    });

    (validatePasswordRules as jest.Mock).mockReturnValue([]);
    (useStudies as jest.Mock).mockReturnValue({
      installedStudyIds: [],
    });
  });

  it("zero state", () => {
    const root = render(<EmailSignupView />);

    expect(useFlagService).toHaveBeenCalled();
    expect(isFlagActive).toHaveBeenCalledWith(Flags.onboardingV2);

    expect(Highlighter).toHaveBeenCalled();
    expect(root.getByText(strings.title)).toBeInTheDocument();

    expect(root.getByText(strings.email)).toBeInTheDocument();
    expect(document.querySelector("input#email")).toBeInTheDocument();
    expect(document.querySelector(".email-error")).not.toBeInTheDocument();

    expect(root.getByText(strings.password)).toBeInTheDocument();
    expect(document.querySelector("input#password")).toBeInTheDocument();
    expect(document.querySelector(".password-error")).not.toBeInTheDocument();

    expect(PasswordRules).toHaveBeenCalledWith(
      {
        className: "mt-3",
        rules: [],
      },
      {}
    );

    expect(LoginButton).toHaveBeenCalled();
    expect(PrivacyNoticeAndLoginLink).toHaveBeenCalled();

    expect(validateLoginForm).not.toHaveBeenCalled();

    assertEmailError(undefined);
    assertPasswordError(undefined);

    expect(signupWithEmail).not.toHaveBeenCalled();
  });

  it("zero state - v2 enabled", () => {
    isFlagActive.mockReturnValue(true);

    const root = render(<EmailSignupView />);

    expect(useFlagService).toHaveBeenCalled();
    expect(isFlagActive).toHaveBeenCalledWith(Flags.onboardingV2);

    // Headless mode - no highlighter or title should be shown
    expect(Highlighter).not.toHaveBeenCalled();
    expect(root.queryByText(strings.title)).not.toBeInTheDocument();

    expect(root.getByText(strings.email)).toBeInTheDocument();
    expect(document.querySelector("input#email")).toBeInTheDocument();
    expect(document.querySelector(".email-error")).not.toBeInTheDocument();

    expect(root.getByText(strings.password)).toBeInTheDocument();
    expect(document.querySelector("input#password")).toBeInTheDocument();
    expect(document.querySelector(".password-error")).not.toBeInTheDocument();

    expect(PasswordRules).toHaveBeenCalledWith(
      {
        className: "mt-3",
        rules: [],
      },
      {}
    );

    expect(LoginButton).toHaveBeenCalled();
    expect(PrivacyNoticeAndLoginLink).toHaveBeenCalled();

    expect(validateLoginForm).not.toHaveBeenCalled();

    assertEmailError(undefined);
    assertPasswordError(undefined);

    expect(signupWithEmail).not.toHaveBeenCalled();
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

    (validateLoginForm as jest.Mock).mockReturnValue(validationResult);

    const user = userEvent.setup();

    render(<EmailSignupView />);

    await setEmail(user, "email");
    await setPassword(user, "password");

    await signup();

    expect(validateLoginForm).toHaveBeenCalledWith("email", "password");

    assertEmailError(validationResult.email.error);
    assertPasswordError(validationResult.password.error);

    expect(PasswordRules).toHaveBeenCalledWith(
      {
        className: "mt-3",
        rules: validationResult.passwordRules,
      },
      {}
    );

    expect(PrivacyNoticeAndLoginLink).toHaveBeenCalled();

    expect(signupWithEmail).not.toHaveBeenCalled();
  });

  it("displays firebase error when signup fails", async () => {
    const firebaseErrorStr = "Some firebase error.";

    (getFirebaseErrorMessage as jest.Mock).mockReturnValue(firebaseErrorStr);

    const thrownError = new Error("Any error would do.");

    (signupWithEmail as jest.Mock).mockImplementation(() => {
      throw thrownError;
    });

    const validationResult: LoginFormValidationResult = {
      email: {},
      password: {},
      passwordRules: [],
      valid: true,
    };

    (validateLoginForm as jest.Mock).mockReturnValue(validationResult);

    const user = userEvent.setup();

    render(<EmailSignupView />);

    await setEmail(user, "email");
    await setPassword(user, "password");

    await signup();

    expect(validateLoginForm).toHaveBeenCalledWith("email", "password");

    expect(signupWithEmail).toHaveBeenCalledWith("email", "password");

    expect(getFirebaseErrorMessage).toHaveBeenCalledWith(thrownError);

    assertEmailError(firebaseErrorStr);
  });

  it("successfully invokes signup with email and sets the login state to email account created", async () => {
    const validationResult: LoginFormValidationResult = {
      email: {},
      password: {},
      passwordRules: [],
      valid: true,
    };

    (validateLoginForm as jest.Mock).mockImplementation(() => validationResult);

    const user = userEvent.setup();

    const root = render(<EmailSignupView />);

    await setEmail(user, "email");
    await setPassword(user, "password");

    createSignupWithEmail(root);

    expect(root.getByText(strings.continue)).toBeInTheDocument();
    expect(root.queryByText(strings.creatingAccount)).not.toBeInTheDocument();

    await signup();

    expect(root.queryByText(strings.continue)).not.toBeInTheDocument();
    expect(root.getByText(strings.creatingAccount)).toBeInTheDocument();

    expect(validateLoginForm).toHaveBeenCalledWith("email", "password");

    expect(signupWithEmail).toHaveBeenCalledWith("email", "password");

    assertEmailError(undefined);
    assertPasswordError(undefined);

    expect(PasswordRules).toHaveBeenCalledWith(
      {
        className: "mt-3",
        rules: validationResult.passwordRules,
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

  async function signup() {
    expect(LoginButton).toHaveBeenCalled();

    const onClick = (LoginButton as jest.Mock).mock.calls[0][0].onClick;

    await act(() => {
      onClick();
    });
  }

  function createSignupWithEmail(root: RenderResult) {
    signupWithEmail.mockImplementation(async () => {
      expect(root.getByText(strings.creatingAccount)).toBeInTheDocument();
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
