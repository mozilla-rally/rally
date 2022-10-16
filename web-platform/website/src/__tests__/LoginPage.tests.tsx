import { render } from "@testing-library/react";
import Head from "next/head";
import { useRouter } from "next/router";

import { LoginPageContent } from "../components/pages/login/LoginPageContent";
import { default as LoginPage } from "../pages/login";
import { Strings } from "../resources/Strings";
import { useAuthentication } from "../services/AuthenticationService";
import { useStudies } from "../services/StudiesService";

jest.mock("next/head");
jest.mock("next/router");

jest.mock("../components/pages/login/LoginPageContent");
jest.mock("../services/AuthenticationService");
jest.mock("../services/StudiesService");

describe("login page tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();

    (Head as jest.Mock).mockImplementation(({ children }) => children);
    (LoginPageContent as jest.Mock).mockImplementation(
      ({ children }) => children
    );
    (useStudies as jest.Mock).mockReturnValue({ installedStudyIds: [] });
  });

  it("renders null when user is not loaded yet", () => {
    (useAuthentication as jest.Mock).mockReturnValue({
      isLoaded: false,
      isUserVerified: false,
    });

    const replace = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ isReady: true, replace });

    const root = render(<LoginPage />);

    expect(root.container.firstChild).toBeNull();

    expect(useAuthentication).toHaveBeenCalled();
    expect(useRouter).toHaveBeenCalled();
    expect(replace).not.toHaveBeenCalled();

    expect(LoginPageContent).not.toHaveBeenCalled();
    expect(Head).not.toHaveBeenCalled();
  });

  it("renders null when router is not loaded yet", () => {
    (useAuthentication as jest.Mock).mockReturnValue({
      isLoaded: true,
      isUserVerified: false,
    });

    const replace = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ isReady: false, replace });

    const root = render(<LoginPage />);

    expect(root.container.firstChild).toBeNull();

    expect(useAuthentication).toHaveBeenCalled();
    expect(useRouter).toHaveBeenCalled();
    expect(replace).not.toHaveBeenCalled();

    expect(LoginPageContent).not.toHaveBeenCalled();
    expect(Head).not.toHaveBeenCalled();
  });

  it("redirects to homepage when user is present and extensions are installed", () => {
    (useAuthentication as jest.Mock).mockReturnValue({
      user: { uid: 123 },
      isLoaded: true,
    });

    (useStudies as jest.Mock).mockReturnValue({ installedStudyIds: [{}] });

    const replace = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ isReady: true, replace });

    const root = render(<LoginPage />);

    expect(replace).toHaveBeenCalledWith("/");

    expect(root.container.firstChild).toBeNull();

    expect(useAuthentication).toHaveBeenCalled();
    expect(useRouter).toHaveBeenCalled();

    expect(LoginPageContent).not.toHaveBeenCalled();
    expect(Head).not.toHaveBeenCalled();
  });

  it("redirects to get-extension when no extensions are present for user", () => {
    (useAuthentication as jest.Mock).mockReturnValue({
      user: { uid: 123 },
      isLoaded: true,
    });

    const replace = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ isReady: true, replace });

    const root = render(<LoginPage />);

    expect(replace).toHaveBeenCalledWith("/get-extension");

    expect(root.container.firstChild).toBeNull();

    expect(useAuthentication).toHaveBeenCalled();
    expect(useRouter).toHaveBeenCalled();

    expect(LoginPageContent).not.toHaveBeenCalled();
  });

  it("renders login page content correctly", () => {
    (useAuthentication as jest.Mock).mockReturnValue({
      user: undefined,
      isLoaded: true,
    });

    const replace = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ isReady: true, replace });

    render(<LoginPage />);

    expect(replace).not.toHaveBeenCalled();

    expect(useAuthentication).toHaveBeenCalled();
    expect(useRouter).toHaveBeenCalled();

    expect(Head).toHaveBeenCalled();

    expect(LoginPageContent).toHaveBeenCalled();

    expect(document.title).toBe(Strings.pages.login.title);
  });

  it("saves email subscription option when set by the content", () => {
    jest.spyOn(Storage.prototype, "getItem");
    jest.spyOn(Storage.prototype, "removeItem");

    Storage.prototype.getItem = jest.fn((name: string) => {
      if (name === "subscribedToEmail") {
        return "true";
      }
      return undefined;
    });

    (useAuthentication as jest.Mock).mockReturnValue({
      user: { uid: 123 },
      isLoaded: true,
    });

    const replace = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ isReady: true, replace });

    const root = render(<LoginPage />);

    expect(replace).toHaveBeenCalledWith("/get-extension");

    expect(root.container.firstChild).toBeNull();

    expect(useAuthentication).toHaveBeenCalled();
    expect(useRouter).toHaveBeenCalled();

    expect(LoginPageContent).not.toHaveBeenCalled();

    expect(sessionStorage.getItem).toHaveBeenCalledWith("subscribedToEmail");

    expect(sessionStorage.removeItem).toHaveBeenCalledWith("subscribedToEmail");
  });
});
