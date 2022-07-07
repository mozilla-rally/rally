import { render } from "@testing-library/react";
import Head from "next/head";
import { useRouter } from "next/router";

import { Layout } from "../components/Layout";
import { LoginPageContent } from "../components/pages/login/LoginPageContent";
import { default as LoginPage } from "../pages/login";
import { Strings } from "../resources/Strings";
import { useAuthentication } from "../services/AuthenticationService";

jest.mock("next/head");
jest.mock("next/router");
jest.mock("../components/Layout");
jest.mock("../services/AuthenticationService");
jest.mock("../components/pages/login/LoginPageContent");

describe("login page tests", () => {
  beforeEach(() => {
    (Layout as jest.Mock).mockImplementation(({ children }) => children);
    (Head as jest.Mock).mockImplementation(({ children }) => children);
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

    expect(root.container.firstChild).toBeNull();

    expect(LoginPageContent).not.toHaveBeenCalled();

    expect(useAuthentication).toHaveBeenCalled();
    expect(useRouter).toHaveBeenCalled();
    expect(replace).not.toHaveBeenCalled();

    expect(Layout).not.toHaveBeenCalled();
    expect(Head).not.toHaveBeenCalled();
  });

  it("redirects to homepage when user is verified", () => {
    (useAuthentication as jest.Mock).mockReturnValue({
      isUserVerified: true,
      isLoaded: true,
    });

    const replace = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ isReady: true, replace });

    const root = render(<LoginPage />);

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
      isUserVerified: false,
      isLoaded: true,
    });

    const replace = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ isReady: true, replace });

    render(<LoginPage />);

    expect(replace).not.toHaveBeenCalled();

    expect(useAuthentication).toHaveBeenCalled();
    expect(useRouter).toHaveBeenCalled();

    expect(Layout).toHaveBeenCalled();

    expect(Head).toHaveBeenCalled();

    expect(LoginPageContent).toHaveBeenCalled();

    expect(document.title).toBe(Strings.pages.login.title);
  });
});
