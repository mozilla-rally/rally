import { render } from "@testing-library/react";
import { isValidElement } from "react";

import { Strings } from "../../../../resources/Strings";
import { PrimaryButton } from "../../../../styles/Buttons";
import { Highlighter } from "../../../Highlighter";
import { EmailAccountCreatedView } from "../EmailAccountCreatedView";
import { LoginButton } from "../LoginButton";
import { LoginState, useLoginDataContext } from "../LoginDataContext";

jest.mock("../../../Highlighter");
jest.mock("../LoginButton");
jest.mock("../LoginDataContext");

const strings = Strings.components.pages.login.emailAccountCreatedView;

describe("EmailAccountCreatedView tests", () => {
  const setLoginState = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    (Highlighter as jest.Mock).mockImplementation(({ children }) => children);
    (LoginButton as jest.Mock).mockImplementation(({ children }) => children);

    (useLoginDataContext as jest.Mock).mockReturnValue({ setLoginState });
  });

  it("renders all the components correctly", () => {
    const root = render(<EmailAccountCreatedView />);

    expect(root.getByText(strings.title)).toBeInTheDocument();
    expect(root.getByText(strings.message)).toBeInTheDocument();

    expect(LoginButton).toHaveBeenCalledWith(
      expect.objectContaining({
        className: PrimaryButton,
        children: strings.backToSignIn,
      }),
      {}
    );

    expect(isValidElement(strings.needHelp)).toBeTruthy();
    expect(setLoginState).not.toHaveBeenCalled();
  });

  it("sets the correct login state when button is clicked", () => {
    render(<EmailAccountCreatedView />);

    expect(LoginButton).toHaveBeenCalledWith(
      expect.objectContaining({
        className: PrimaryButton,
        children: strings.backToSignIn,
      }),
      {}
    );

    (LoginButton as jest.Mock).mock.calls[0][0].onClick();

    expect(setLoginState).toHaveBeenCalledWith(LoginState.Login);
  });
});
