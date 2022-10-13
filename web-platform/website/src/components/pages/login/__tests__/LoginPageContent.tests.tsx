import { render } from "@testing-library/react";
import { isValidElement } from "react";

import { Strings } from "../../../../resources/Strings";
import { useStudies } from "../../../../services/StudiesService";
import { TwoColumnLayout } from "../../../TwoColumnLayout";
import { LoginCardFactory } from "../LoginCardFactory";
import {
  LoginState,
  LoginStateProvider,
  useLoginDataContext,
} from "../LoginDataContext";
import { LoginPageContent } from "../LoginPageContent";

jest.mock("../../../../services/StudiesService");
jest.mock("../../../TwoColumnLayout");
jest.mock("../LoginCardFactory");
jest.mock("../LoginDataContext");

const strings = Strings.components.pages.login.loginPageContentV2;

describe("LoginPageContent tests", () => {
  beforeEach(() => {
    (TwoColumnLayout as unknown as jest.Mock).mockImplementation(
      ({ children }) => children
    );

    (TwoColumnLayout.LeftContent as jest.Mock).mockImplementation(
      ({ children }) => children
    );

    (TwoColumnLayout.RightContent as jest.Mock).mockImplementation(
      ({ children }) => children
    );

    (LoginStateProvider as jest.Mock).mockImplementation(
      ({ children }) => children
    );

    (useLoginDataContext as jest.Mock).mockReturnValue({
      loginState: LoginState.Initial,
    });

    (useStudies as jest.Mock).mockReturnValue({
      installedStudyIds: [],
    });
  });

  it("renders initial content correctly - account first", () => {
    const root = render(
      <LoginPageContent>
        <div>Child content</div>
      </LoginPageContent>
    );

    expect(LoginStateProvider).toHaveBeenCalled();
    expect(root.getByText("Child content")).toBeInTheDocument();
    expect(LoginCardFactory).toHaveBeenCalled();

    expect(isValidElement(strings.titles.accountFirst.title)).toBeTruthy();

    expect(
      root.getByText(strings.titles.accountFirst.subtitle)
    ).toBeInTheDocument();

    expect(
      root.getByText(strings.valuePropositions.default.tagline)
    ).toBeInTheDocument();

    expect(
      document.querySelector(`img[src="/img/illustration-group-rally.png"]`)
    ).toBeInTheDocument();
  });

  it("renders initial content correctly - extension first", () => {
    (useStudies as jest.Mock).mockReturnValue({
      installedStudyIds: ["attention-stream"],
    });

    const root = render(
      <LoginPageContent>
        <div>Child content</div>
      </LoginPageContent>
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
      <LoginPageContent>
        <div>Child content</div>
      </LoginPageContent>
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
