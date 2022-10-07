import { render } from "@testing-library/react";
import Head from "next/head";
import { useRouter } from "next/router";

import { Layout } from "../components/Layout";
import { LoginPageContent } from "../components/pages/login/LoginPageContent";
import { LoginPageContentV2 } from "../components/pages/login/LoginPageContentV2";
import { default as LoginPage } from "../pages/login";
import { Flags } from "../resources/Flags";
import { Strings } from "../resources/Strings";
import { useAuthentication } from "../services/AuthenticationService";
import { useFlagService } from "../services/FlagService";

jest.mock("next/head");
jest.mock("next/router");
jest.mock("../components/Layout");
jest.mock("../components/pages/login/LoginPageContent");
jest.mock("../components/pages/login/LoginPageContentV2");
jest.mock("../services/AuthenticationService");
jest.mock("../services/FlagService");

describe("login page tests", () => {
  const isFlagActive = jest.fn();

  beforeEach(() => {
    (useFlagService as jest.Mock).mockReturnValue({
      isFlagActive,
    });

    (Layout as jest.Mock).mockImplementation(({ children }) => children);
    (Head as jest.Mock).mockImplementation(({ children }) => children);
    (LoginPageContentV2 as jest.Mock).mockImplementation(
      ({ children }) => children
    );
  });

  it("renders null when user is not loaded yet", () => {
    (useAuthentication as jest.Mock).mockReturnValue({
      isLoaded: false,
      isUserVerified: false,
    });

    const replace = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ isReady: true, replace });

    const root = render(<LoginPage />);

    expect(useFlagService).toHaveBeenCalled();
    expect(isFlagActive).not.toHaveBeenCalled();

    expect(root.container.firstChild).toBeNull();

    expect(LoginPageContent).not.toHaveBeenCalled();

    expect(useAuthentication).toHaveBeenCalled();
    expect(useRouter).toHaveBeenCalled();
    expect(replace).not.toHaveBeenCalled();

    expect(Layout).not.toHaveBeenCalled();
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

    expect(useFlagService).toHaveBeenCalled();
    expect(isFlagActive).not.toHaveBeenCalled();

    expect(root.container.firstChild).toBeNull();

    expect(LoginPageContent).not.toHaveBeenCalled();

    expect(useAuthentication).toHaveBeenCalled();
    expect(useRouter).toHaveBeenCalled();
    expect(replace).not.toHaveBeenCalled();

    expect(Layout).not.toHaveBeenCalled();
    expect(Head).not.toHaveBeenCalled();
  });

  it("redirects to homepage when user is present", () => {
    (useAuthentication as jest.Mock).mockReturnValue({
      user: { uid: 123 },
      isLoaded: true,
    });

    const replace = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ isReady: true, replace });

    const root = render(<LoginPage />);

    expect(useFlagService).toHaveBeenCalled();

    expect(replace).toHaveBeenCalledWith("/");

    expect(root.container.firstChild).toBeNull();

    expect(LoginPageContent).not.toHaveBeenCalled();

    expect(useAuthentication).toHaveBeenCalled();
    expect(useRouter).toHaveBeenCalled();

    expect(Layout).not.toHaveBeenCalled();
    expect(Head).not.toHaveBeenCalled();
  });

  it("renders login page content correctly", () => {
    (useAuthentication as jest.Mock).mockReturnValue({
      user: undefined,
      isLoaded: true,
    });

    const replace = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ isReady: true, replace });

    render(<LoginPage />);

    expect(useFlagService).toHaveBeenCalled();
    expect(isFlagActive).toHaveBeenCalledWith(Flags.onboardingV2.name);

    expect(replace).not.toHaveBeenCalled();

    expect(useAuthentication).toHaveBeenCalled();
    expect(useRouter).toHaveBeenCalled();

    expect(Layout).toHaveBeenCalled();

    expect(Head).toHaveBeenCalled();

    expect(LoginPageContent).toHaveBeenCalled();

    expect(LoginPageContentV2).not.toHaveBeenCalled();

    expect(document.title).toBe(Strings.pages.login.title);
  });

  it("renders v2 content when flag is set to true", () => {
    (useAuthentication as jest.Mock).mockReturnValue({
      user: undefined,
      isLoaded: true,
    });

    const replace = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ isReady: true, replace });

    isFlagActive.mockReturnValue(true);

    render(<LoginPage />);

    expect(useFlagService).toHaveBeenCalled();
    expect(isFlagActive).toHaveBeenCalledWith(Flags.onboardingV2.name);

    expect(replace).not.toHaveBeenCalled();

    expect(useAuthentication).toHaveBeenCalled();
    expect(useRouter).toHaveBeenCalled();

    expect(Layout).not.toHaveBeenCalled();

    expect(Head).toHaveBeenCalled();

    expect(LoginPageContent).not.toHaveBeenCalled();

    expect(LoginPageContentV2).toHaveBeenCalled();

    expect(document.title).toBe(Strings.pages.login.title);
  });
});
