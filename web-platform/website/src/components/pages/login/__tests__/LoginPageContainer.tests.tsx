import { render } from "@testing-library/react";

import { useAuthentication } from "../../../../services/AuthenticationService";
import { EmailAccountCreatedView } from "../EmailAccountCreatedView";
import { EmailSignupView } from "../EmailSignupView";
import { InitialLoginView } from "../InitialLoginView";
import {
  LoginState,
  LoginStateProvider,
  useLoginDataContext,
} from "../LoginDataContext";
import { LoginPageContainer } from "../LoginPageContainer";
import { LoginView } from "../LoginView";

jest.mock("../../../../services/AuthenticationService");
jest.mock("../EmailAccountCreatedView");
jest.mock("../EmailSignupView");
jest.mock("../InitialLoginView");
jest.mock("../LoginDataContext");
jest.mock("../LoginView");

describe("LoginPageContainer tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (LoginStateProvider as jest.Mock).mockImplementation(
      (props) => props.children
    );
    (useLoginDataContext as jest.Mock).mockImplementation(() => ({
      loginState: LoginState.Initial,
    }));
    (EmailSignupView as jest.Mock).mockImplementation(() => null);
    (InitialLoginView as jest.Mock).mockImplementation(() => null);
    (useAuthentication as jest.Mock).mockReturnValue({ user: undefined });
  });

  it("renders initial state correctly", () => {
    render(<LoginPageContainer />);

    expect(useLoginDataContext).toHaveBeenCalled();
    expect(InitialLoginView).toHaveBeenCalled();
  });

  it("renders email signup view", () => {
    (useLoginDataContext as jest.Mock).mockClear().mockImplementation(() => ({
      loginState: LoginState.SignupWithEmail,
    }));

    render(<LoginPageContainer />);

    expect(useLoginDataContext).toHaveBeenCalled();
    expect(EmailSignupView).toHaveBeenCalled();
  });

  it("renders email account created view", () => {
    (useLoginDataContext as jest.Mock).mockImplementation(() => ({
      loginState: LoginState.EmailAccountCreated,
    }));

    render(<LoginPageContainer />);

    expect(EmailAccountCreatedView).toHaveBeenCalled();
  });

  it("renders login view", () => {
    (useLoginDataContext as jest.Mock).mockImplementation(() => ({
      loginState: LoginState.Login,
    }));

    render(<LoginPageContainer />);

    expect(LoginView).toHaveBeenCalled();
  });

  it("throws when loginState is invalid", () => {
    (useLoginDataContext as jest.Mock).mockReset().mockImplementation(() => ({
      loginState: undefined,
    }));

    jest.spyOn(console, "error").mockImplementation(() => {}); //eslint-disable-line @typescript-eslint/no-empty-function

    expect(() => render(<LoginPageContainer />)).toThrowError(
      "Invalid card type."
    );
  });

  it("redirects to homepage when user is already logged in", async () => {
    (useAuthentication as jest.Mock).mockReturnValue({ user: {} });

    const root = render(<LoginPageContainer />);

    expect(document.location.href).toBe(root.container.baseURI);
  });
});
