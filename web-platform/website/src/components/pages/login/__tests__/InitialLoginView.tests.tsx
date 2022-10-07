import { RenderResult, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";

import { Flags } from "../../../../resources/Flags";
import { Strings } from "../../../../resources/Strings";
import { useAuthentication } from "../../../../services/AuthenticationService";
import { useFlagService } from "../../../../services/FlagService";
import { Highlighter } from "../../../Highlighter";
import { InitialLoginView } from "../InitialLoginView";
import { LoginState, useLoginDataContext } from "../LoginDataContext";

jest.mock("../../../../services/AuthenticationService");
jest.mock("../../../../services/FlagService");
jest.mock("../../../Highlighter");
jest.mock("../LoginDataContext");

const strings = Strings.components.pages.login.initialLoginView;

describe("InitialLoginView tests", () => {
  const loginWithGoogle = jest.fn();
  const setLoginState = jest.fn();
  const isFlagActive = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    (useFlagService as jest.Mock).mockReturnValue({
      isFlagActive,
    });

    (Highlighter as jest.Mock).mockImplementation((props) => (
      <>{props.children}</>
    ));

    (useAuthentication as jest.Mock).mockReturnValue({ loginWithGoogle });
    (useLoginDataContext as jest.Mock).mockReturnValue({ setLoginState });
  });

  it("renders all components correctly", () => {
    const root = render(<InitialLoginView />);

    assertTitlePresent(root);
    assertSignupWithGooglePresent(root);
    assertSignupWithEmailPresent(root);

    expect(useFlagService).toHaveBeenCalled();
    expect(isFlagActive).toHaveBeenCalledWith(Flags.onboardingV2);

    expect(useAuthentication).toHaveBeenCalled();
    expect(useLoginDataContext).toHaveBeenCalled();
  });

  it("renders all components correctly in v2", () => {
    isFlagActive.mockReturnValue(true);

    const root = render(<InitialLoginView />);

    assertTitleNotPresent(root);
    assertSignupWithGooglePresent(root);
    assertSignupWithEmailPresent(root);

    expect(useFlagService).toHaveBeenCalled();
    expect(isFlagActive).toHaveBeenCalledWith(Flags.onboardingV2);

    expect(useAuthentication).toHaveBeenCalled();
    expect(useLoginDataContext).toHaveBeenCalled();
  });

  it("login with google invokes the correct authentication function", async () => {
    userEvent.setup();

    const root = render(<InitialLoginView />);

    await act(async () => {
      await userEvent.click(root.getByText(strings.signInWithGoogle));
    });

    expect(loginWithGoogle).toHaveBeenCalled();
  });

  it("login with email sets the correct login state", async () => {
    userEvent.setup();

    const root = render(<InitialLoginView />);

    await act(async () => {
      await userEvent.click(root.getByText(strings.signInWithEmail));
    });

    expect(setLoginState).toHaveBeenCalledWith(LoginState.SignupWithEmail);
  });

  function assertTitlePresent(root: RenderResult) {
    expect(Highlighter).toHaveBeenCalled();
    expect(root.getByText(strings.title)).toBeInTheDocument();
  }

  function assertTitleNotPresent(root: RenderResult) {
    expect(Highlighter).not.toHaveBeenCalled();
    expect(root.queryByText(strings.title)).not.toBeInTheDocument();
  }

  function assertSignupWithGooglePresent(root: RenderResult) {
    expect(root.getByText(strings.signInWithGoogle)).toBeInTheDocument();
    expect(
      document.querySelector(`img[src="/img/icon-logo-google.svg"]`)
    ).toBeInTheDocument();
  }

  function assertSignupWithEmailPresent(root: RenderResult) {
    expect(root.getByText(strings.signInWithEmail)).toBeInTheDocument();
    expect(
      document.querySelector(`img[src="/img/icon-email.svg"]`)
    ).toBeInTheDocument();
  }
});
