import { render } from "@testing-library/react";
import { isValidElement } from "react";

import { Strings } from "../../../../resources/Strings";
import { LoginCardFactory } from "../LoginCardFactory";
import {
  LoginState,
  LoginStateProvider,
  useLoginDataContext,
} from "../LoginDataContext";
import { LoginPageContentV2 } from "../LoginPageContentV2";
import { LoginPageLayoutV2 } from "../LoginPageLayoutV2";

jest.mock("../LoginCardFactory");
jest.mock("../LoginDataContext");
jest.mock("../LoginPageLayoutV2");

const strings = Strings.components.pages.login.loginPageContentV2;

describe("LoginPageContentV2 tests", () => {
  beforeEach(() => {
    (LoginPageLayoutV2 as unknown as jest.Mock).mockImplementation(
      ({ children }) => children
    );

    (LoginPageLayoutV2.LeftContent as jest.Mock).mockImplementation(
      ({ children }) => children
    );

    (LoginPageLayoutV2.RightContent as jest.Mock).mockImplementation(
      ({ children }) => children
    );

    (LoginStateProvider as jest.Mock).mockImplementation(
      ({ children }) => children
    );

    (useLoginDataContext as jest.Mock).mockReturnValue({
      loginState: LoginState.Initial,
    });
  });

  it("renders initial content correctly", () => {
    const root = render(
      <LoginPageContentV2>
        <div>Child content</div>
      </LoginPageContentV2>
    );

    expect(LoginStateProvider).toHaveBeenCalled();
    expect(root.getByText("Child content")).toBeInTheDocument();
    expect(LoginCardFactory).toHaveBeenCalled();

    expect(isValidElement(strings.titles.extensionFirst.title)).toBeTruthy();

    expect(
      root.getByText(strings.titles.extensionFirst.subtitle)
    ).toBeInTheDocument();

    expect(
      root.getByText(strings.valuePropositions.default.tagline)
    ).toBeInTheDocument();

    expect(
      document.querySelector(`img[src="/img/illustration-group-rally.png"]`)
    ).toBeInTheDocument();
  });

  it("does not render title when login state is set to login", () => {
    (useLoginDataContext as jest.Mock).mockReturnValue({
      loginState: LoginState.Login,
    });

    assertNoHeaderTextState();
  });

  it("does not render title when login state is set to reset password", () => {
    (useLoginDataContext as jest.Mock).mockReturnValue({
      loginState: LoginState.ResetPassword,
    });

    assertNoHeaderTextState();
  });

  function assertNoHeaderTextState() {
    const root = render(
      <LoginPageContentV2>
        <div>Child content</div>
      </LoginPageContentV2>
    );

    expect(LoginStateProvider).toHaveBeenCalled();
    expect(root.getByText("Child content")).toBeInTheDocument();
    expect(LoginCardFactory).toHaveBeenCalled();

    expect(
      root.queryByText(strings.titles.extensionFirst.subtitle)
    ).not.toBeInTheDocument();

    expect(
      root.getByText(strings.valuePropositions.default.tagline)
    ).toBeInTheDocument();

    expect(
      document.querySelector(`img[src="/img/illustration-group-rally.png"]`)
    ).toBeInTheDocument();
  }
});
