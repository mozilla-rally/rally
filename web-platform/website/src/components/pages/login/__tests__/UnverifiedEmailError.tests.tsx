import { act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Strings } from "../../../../resources/Strings";
import { useAuthentication } from "../../../../services/AuthenticationService";
import { LoginState, useLoginDataContext } from "../LoginDataContext";
import { UnverifiedEmailError } from "../UnverifiedEmailError";

jest.mock("../../../../services/AuthenticationService");
jest.mock("../LoginDataContext");

const strings = Strings.components.pages.login.unverifiedEmailError;

describe("UnverifiedEmailError tests", () => {
  it("renders content and resends confirmation email", async () => {
    const sendEmailVerification = jest.fn();
    const logout = jest.fn();

    (useAuthentication as jest.Mock).mockReturnValue({
      sendEmailVerification,
      logout,
    });

    const setLoginState = jest.fn();

    (useLoginDataContext as jest.Mock).mockReturnValue({ setLoginState });

    const user = userEvent.setup();

    const root = render(<UnverifiedEmailError />);

    expect(useAuthentication).toHaveBeenCalled();
    expect(useLoginDataContext).toHaveBeenCalled();

    expect(
      document.querySelector(`img[src="img/error.svg"]`)
    ).toBeInTheDocument();

    expect(root.getByText(strings.activateEmail)).toBeInTheDocument();

    expect(root.getByText(strings.cantFindEmail)).toBeInTheDocument();

    const resendLink = root.getByText(strings.resendEmail) as HTMLElement;

    expect(resendLink).toBeInTheDocument();

    await act(async () => await user.click(resendLink));

    expect(sendEmailVerification).toHaveBeenCalled();
    expect(logout).toHaveBeenCalled();
    expect(setLoginState).toHaveBeenCalledWith(LoginState.Initial);
  });
});
