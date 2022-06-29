import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserEvent } from "@testing-library/user-event/dist/types/setup";
import { act } from "react-dom/test-utils";

import { Strings } from "../../../../resources/Strings";
import { useAuthentication } from "../../../../services/AuthenticationService";
import { getFirebaseErrorMessage } from "../../../../utils/FirebaseErrors";
import { Highlighter } from "../../../Highlighter";
import { LoginButton } from "../LoginButton";
import { LoginState, useLoginDataContext } from "../LoginDataContext";
import { validateEmailAndReturnError } from "../LoginFormValidator";
import { ResetPasswordView } from "../ResetPasswordView";

jest.mock("../../../../services/AuthenticationService");
jest.mock("../../../../utils/FirebaseErrors");
jest.mock("../../../Highlighter");
jest.mock("../LoginButton");
jest.mock("../LoginDataContext");
jest.mock("../LoginFormValidator");

const strings = Strings.components.pages.login.resetPasswordView;

describe("ResetPasswordView tests", () => {
  const sendPasswordResetEmail = jest.fn();
  const setLoginState = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    (Highlighter as jest.Mock).mockImplementation(({ children }) => children);
    (LoginButton as jest.Mock).mockImplementation(({ children }) => children);

    (useAuthentication as jest.Mock).mockReturnValue({
      sendPasswordResetEmail,
    });

    (useLoginDataContext as jest.Mock).mockReturnValue({
      setLoginState,
    });
  });

  it("zero state", () => {
    const root = render(<ResetPasswordView />);

    expect(Highlighter).toHaveBeenCalled();
    expect(root.getByText(strings.preEmailSent.title)).toBeInTheDocument();
    expect(root.getByText(strings.preEmailSent.message)).toBeInTheDocument();

    expect(root.getByText(strings.preEmailSent.email)).toBeInTheDocument();
    expect(document.querySelector("input#email")).toBeInTheDocument();
    expect(document.querySelector(".email-error")).not.toBeInTheDocument();

    expect(
      root.getByText(strings.preEmailSent.resetPassword)
    ).toBeInTheDocument();

    expect(root.getByText(strings.preEmailSent.signIn)).toBeInTheDocument();

    expect(LoginButton).toHaveBeenCalled();

    assertEmailError(undefined);

    expect(
      root.queryByText(strings.postEmailSent.backToSignIn)
    ).not.toBeInTheDocument();

    expect(
      root.queryByText((content) => content.includes("Need additional help"))
    ).not.toBeInTheDocument();

    expect(sendPasswordResetEmail).not.toHaveBeenCalled();
    expect(setLoginState).not.toHaveBeenCalled();
  });

  it("email errors are correctly displayed", async () => {
    const emailError = "Invalid email";
    (validateEmailAndReturnError as jest.Mock).mockReturnValue(emailError);

    const userEvents = userEvent.setup();

    render(<ResetPasswordView />);

    const email = "joe@doe.com";
    await setEmail(userEvents, email);

    await act(async () => {
      await resetPassword();
    });

    expect(validateEmailAndReturnError).toHaveBeenCalledWith(email);

    assertEmailError(emailError);

    expect(sendPasswordResetEmail).not.toHaveBeenCalled();
    expect(setLoginState).not.toHaveBeenCalled();
  });

  it("firebase errors are correctly displayed", async () => {
    const firebaseError = { code: "auth/user-not-found" };
    const applicationError = "Interpreted firebase error message";

    (getFirebaseErrorMessage as jest.Mock).mockReturnValue(applicationError);

    sendPasswordResetEmail.mockImplementation(() => {
      throw firebaseError;
    });

    const userEvents = userEvent.setup();

    (validateEmailAndReturnError as jest.Mock).mockReturnValue("");

    const root = render(<ResetPasswordView />);

    const email = "joe@doe.com";
    await setEmail(userEvents, email);

    await act(async () => {
      await resetPassword();
    });

    expect(getFirebaseErrorMessage).toHaveBeenCalledWith(firebaseError);
  });

  it("sending the email switches to post email view", async () => {
    const userEvents = userEvent.setup();

    (validateEmailAndReturnError as jest.Mock).mockReturnValue("");

    const root = render(<ResetPasswordView />);

    const email = "joe@doe.com";
    await setEmail(userEvents, email);

    await act(async () => {
      await resetPassword();
    });

    assertEmailError(undefined);

    expect(sendPasswordResetEmail).toHaveBeenCalledWith(email);
    expect(setLoginState).not.toHaveBeenCalled();

    expect(
      root.getByText(strings.postEmailSent.backToSignIn)
    ).toBeInTheDocument();

    expect(
      root.queryByText((content) => content.includes("Need additional help"))
    ).toBeInTheDocument();

    await backToSignIn();

    expect(setLoginState).toHaveBeenCalledWith(LoginState.Login);
  });

  async function resetPassword() {
    expect(LoginButton).toHaveBeenCalled();

    const onClick = (LoginButton as jest.Mock).mock.calls.find(
      (call) => call[0].children === strings.preEmailSent.resetPassword
    )[0].onClick;

    await act(() => {
      onClick();
    });
  }

  async function backToSignIn() {
    expect(LoginButton).toHaveBeenCalled();

    const onClick = (LoginButton as jest.Mock).mock.calls.find(
      (call) => call[0].children === strings.postEmailSent.backToSignIn
    )[0].onClick;

    await act(() => {
      onClick();
    });
  }

  async function setEmail(userEvent: UserEvent, email: string) {
    const emailTextBox = document.querySelector("input#email") as Element;

    expect(emailTextBox).toBeInTheDocument();

    await act(async () => {
      await userEvent.type(emailTextBox, email);
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
});
