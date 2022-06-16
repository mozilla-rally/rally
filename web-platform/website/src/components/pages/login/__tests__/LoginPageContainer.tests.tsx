import { render } from "@testing-library/react";

import { Strings } from "../../../../resources/Strings";
import { InitialLoginView } from "../InitialLoginView";
import {
  LoginState,
  LoginStateProvider,
  useLoginDataContext,
} from "../LoginDataContext";
import { LoginPageContainer } from "../LoginPageContainer";

jest.mock("../InitialLoginView");
jest.mock("../LoginDataContext");

const strings = Strings.components.pages.login.loginPageContainer;

describe("LoginPageContainer tests", () => {
  beforeEach(() => {
    (LoginStateProvider as jest.Mock).mockImplementation(
      (props) => props.children
    );
    (useLoginDataContext as jest.Mock).mockImplementation(() => ({
      loginState: LoginState.Initial,
    }));
    (InitialLoginView as jest.Mock).mockImplementation(() => null);
  });

  it("renders initial state correctly", () => {
    render(<LoginPageContainer />);

    assertLogoPresent();
    assertPrivacyLinkPresent();

    expect(useLoginDataContext).toHaveBeenCalled();
    expect(InitialLoginView).toHaveBeenCalled();
  });

  it("throws when loginState is invalid", () => {
    (useLoginDataContext as jest.Mock).mockReset().mockImplementation(() => ({
      loginState: undefined,
    }));

    expect(() => render(<LoginPageContainer />)).toThrowError(
      "Invalid card type."
    );
  });

  function assertLogoPresent() {
    const logoImage = document.querySelector(`img[src="/img/logo-wide.svg"]`);
    expect(logoImage).toBeInTheDocument();
  }

  function assertPrivacyLinkPresent() {
    const privacyLink = document.querySelector(
      `a[href="https://rally.mozilla.org/how-rally-works/"]`
    ) as Element;
    expect(privacyLink).toBeInTheDocument();

    expect(privacyLink.children.length).toBe(2);

    const linkTextSpan = privacyLink.children[0];
    const linkText = linkTextSpan.innerHTML;
    expect(linkText).toBe(strings.howDoesItWork);

    const externalLinkIcon = privacyLink.children[1];
    expect(externalLinkIcon.nodeName).toBe("IMG");
    expect(externalLinkIcon.getAttribute("src")).toBe(
      "img/icon-external-link.svg"
    );
  }
});
