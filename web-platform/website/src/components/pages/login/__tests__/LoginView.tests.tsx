import { FirebaseError } from "@firebase/util";
import { act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserEvent } from "@testing-library/user-event/dist/types/setup";

import { Strings } from "../../../../resources/Strings";
import { useAuthentication } from "../../../../services/AuthenticationService";
import { getFirebaseErrorMessage } from "../../../../utils/FirebaseErrors";
import { Highlighter } from "../../../Highlighter";
import { LoginButton } from "../LoginButton";
import { LoginState, useLoginDataContext } from "../LoginDataContext";
import {
  LoginFormValidationResult,
  validateLoginForm,
} from "../LoginFormValidator";
import { LoginView } from "../LoginView";

jest.mock("../../../../services/AuthenticationService");
jest.mock("../../../Highlighter");
jest.mock("../LoginButton");
jest.mock("../LoginDataContext");
jest.mock("../LoginFormValidator");

const strings = Strings.components.pages.login.loginView;

describe("LoginView tests", () => {
  const loginWithEmail = jest.fn();
  const loginWithGoogle = jest.fn();
  const setLoginState = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    (useAuthentication as jest.Mock).mockReturnValue({
      loginWithEmail,
      loginWithGoogle,
    });
    (Highlighter as jest.Mock).mockImplementation(({ children }) => children);
    (LoginButton as jest.Mock).mockImplementation(() => null);
    (useLoginDataContext as jest.Mock).mockReturnValue({
      setLoginState,
    });
  });

  it("zero state", () => {
    const root = render(<LoginView />);

    expect(Highlighter).toHaveBeenCalled();
    expect(root.getByText(strings.title)).toBeInTheDocument();

    expect(root.getByText(strings.email)).toBeInTheDocument();
    expect(document.querySelector("input#email")).toBeInTheDocument();
    expect(document.querySelector(".email-error")).not.toBeInTheDocument();

    expect(root.getByText(strings.password)).toBeInTheDocument();
    expect(document.querySelector("input#password")).toBeInTheDocument();
    expect(document.querySelector(".password-error")).not.toBeInTheDocument();

    expect(LoginButton).toHaveBeenCalled();

    assertEmailError(undefined);
    assertPasswordError(undefined);

    expect(loginWithEmail).not.toHaveBeenCalled();
    expect(loginWithGoogle).not.toHaveBeenCalled();
  });

  it("invokes login by google when button is clicked", async () => {
    userEvent.setup();

    render(<LoginView />);

    const onClick = (LoginButton as jest.Mock).mock.calls[0][0].onClick;

    await act(() => {
      onClick();
    });

    expect(loginWithGoogle).toHaveBeenCalled();
  });

  it("displays email and password validation errors", async () => {
    const validationResult: LoginFormValidationResult = {
      email: { error: "Email error" },
      password: { error: "Password error" },
      passwordRules: [],
      valid: false,
    };

    (validateLoginForm as jest.Mock).mockReturnValue(validationResult);

    const user = userEvent.setup();

    render(<LoginView />);

    await setEmail(user, "email");
    await setPassword(user, "password");

    await login();

    expect(validateLoginForm).toHaveBeenCalledWith("email", "password");

    assertEmailError("Email error");
    assertPasswordError("Password error");

    expect(loginWithEmail).not.toHaveBeenCalled();
  });

  it("displays password error when loginWithEmail throws a password related error", async () => {
    const validationResult: LoginFormValidationResult = {
      email: {},
      password: {},
      passwordRules: [],
      valid: true,
    };

    (validateLoginForm as jest.Mock).mockReturnValue(validationResult);

    const user = userEvent.setup();
    const error = {
      code: "auth/wrong-password",
    };

    (loginWithEmail as jest.Mock).mockImplementation(() => {
      throw error;
    });

    render(<LoginView />);

    await setEmail(user, "email");
    await setPassword(user, "password");

    jest.spyOn(console, "error").mockImplementation(() => {}); //eslint-disable-line @typescript-eslint/no-empty-function

    await login();

    expect(loginWithEmail).toHaveBeenCalledWith("email", "password");

    assertEmailError(undefined);
    assertPasswordError(getFirebaseErrorMessage(error as FirebaseError));
  });

  it("displays email error when loginWithEmail throws a non-password related error", async () => {
    const validationResult: LoginFormValidationResult = {
      email: {},
      password: {},
      passwordRules: [],
      valid: true,
    };

    (validateLoginForm as jest.Mock).mockReturnValue(validationResult);

    const user = userEvent.setup();
    const error = {
      code: "auth/network-request-failed",
    };

    (loginWithEmail as jest.Mock).mockImplementation(() => {
      throw error;
    });

    render(<LoginView />);

    await setEmail(user, "email");
    await setPassword(user, "password");

    jest.spyOn(console, "error").mockImplementation(() => {}); //eslint-disable-line @typescript-eslint/no-empty-function

    await login();

    expect(loginWithEmail).toHaveBeenCalledWith("email", "password");

    assertEmailError(getFirebaseErrorMessage(error as FirebaseError));
    assertPasswordError(undefined);
  });

  it("redirects to homepage when user is logged in", async () => {
    const validationResult: LoginFormValidationResult = {
      email: {},
      password: {},
      passwordRules: [],
      valid: true,
    };

    (validateLoginForm as jest.Mock).mockReturnValue(validationResult);

    const user = userEvent.setup();

    const root = render(<LoginView />);

    await setEmail(user, "email");
    await setPassword(user, "password");

    await login();

    expect(loginWithEmail).toHaveBeenCalledWith("email", "password");

    assertEmailError(undefined);
    assertPasswordError(undefined);

    expect(document.location.href).toBe(root.container.baseURI);
  });

  it("sets the login state to initial state when create account is clicked", async () => {
    const validationResult: LoginFormValidationResult = {
      email: {},
      password: {},
      passwordRules: [],
      valid: true,
    };

    (validateLoginForm as jest.Mock).mockReturnValue(validationResult);

    const user = userEvent.setup();

    const root = render(<LoginView />);

    const createAccountLink = root.getByText(strings.createAccount);

    await act(async () => {
      await user.click(createAccountLink);
    });

    expect(setLoginState).toHaveBeenCalledWith(LoginState.Initial);
  });

  async function login() {
    expect(LoginButton).toHaveBeenCalled();

    const onClick = (LoginButton as jest.Mock).mock.calls[1][0].onClick;

    await act(() => {
      onClick();
    });
  }

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
