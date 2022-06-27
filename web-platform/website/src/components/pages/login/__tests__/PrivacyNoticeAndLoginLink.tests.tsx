import { render } from "@testing-library/react";
import { isValidElement } from "react";

import { Strings } from "../../../../resources/Strings";
import { LoginState, useLoginDataContext } from "../LoginDataContext";
import { PrivacyNoticeAndLoginLink } from "../PrivacyNoticeAndLoginLink";

jest.mock("../LoginDataContext");

const strings = Strings.components.pages.login.privacyNoticeAndLoginLink;

describe("PrivacyNoticeAndLoginLink tests", () => {
  const setLoginState = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    (useLoginDataContext as jest.Mock).mockReturnValue({ setLoginState });
  });

  it("renders privacy policy and login link correctly", () => {
    const root = render(<PrivacyNoticeAndLoginLink />);

    expect(isValidElement(strings.privacyNotice)).toBeTruthy();
    expect(isValidElement(strings.accountExists)).toBeTruthy();

    const signInLink = root.getByText(strings.signIn);
    expect(signInLink).toBeInTheDocument();

    expect(setLoginState).not.toHaveBeenCalled();

    signInLink.click();

    expect(setLoginState).toHaveBeenCalledWith(LoginState.Login);
  });
});
