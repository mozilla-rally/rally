import { render } from "@testing-library/react";
import { isValidElement } from "react";

import { Strings } from "../../../../resources/Strings";
import { PrivacyNoticeAndLoginLink } from "../PrivacyNoticeAndLoginLink";

const strings = Strings.components.pages.login.privacyNoticeAndLoginLink;

describe("PrivacyNoticeAndLoginLink tests", () => {
  it("renders privacy policy and login link correctly", () => {
    const root = render(<PrivacyNoticeAndLoginLink />);

    expect(isValidElement(strings.privacyNotice)).toBeTruthy();
    expect(isValidElement(strings.accountExists)).toBeTruthy();

    const signInLink = root.getByText(strings.signIn);
    expect(signInLink).toBeInTheDocument();
  });
});
