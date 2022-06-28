import { render } from "@testing-library/react";
import { useRouter } from "next/router";

import { useAuthentication } from "../../services/AuthenticationService";
import { AuthenticatedPage } from "../AuthenticatedPage";

jest.mock("next/router");
jest.mock("../../services/AuthenticationService");

describe("AuthenticatedPage tests", () => {
  it("renders null when router is not ready despite loading user", () => {
    const replace = jest.fn();

    (useRouter as jest.Mock).mockReturnValue({
      isReady: false,
      replace,
    });

    (useAuthentication as jest.Mock).mockReturnValue({
      isLoaded: true,
      user: {},
    });

    const root = render(
      <AuthenticatedPage>
        <div>Test</div>
      </AuthenticatedPage>
    );

    expect(root.container.childNodes.length).toBe(0);

    expect(replace).not.toHaveBeenCalled();
  });

  it("renders null when router is ready but user has not loaded yet", () => {
    const replace = jest.fn();

    (useRouter as jest.Mock).mockReturnValue({
      isReady: false,
      replace,
    });

    (useAuthentication as jest.Mock).mockReturnValue({
      isLoaded: false,
      user: undefined,
    });

    const root = render(
      <AuthenticatedPage>
        <div>Test</div>
      </AuthenticatedPage>
    );

    expect(root.container.childNodes.length).toBe(0);

    expect(replace).not.toHaveBeenCalled();
  });

  it("routes to login when user is not authenticated", () => {
    const replace = jest.fn();

    (useRouter as jest.Mock).mockReturnValue({
      isReady: true,
      replace,
    });

    (useAuthentication as jest.Mock).mockReturnValue({
      isLoaded: true,
      user: undefined,
    });

    const root = render(
      <AuthenticatedPage>
        <div>Test</div>
      </AuthenticatedPage>
    );

    expect(root.container.childNodes.length).toBe(0);

    expect(replace).toHaveBeenCalledWith("/login");
  });

  it("renders the page content when user is authenticated and router is ready", () => {
    const replace = jest.fn();

    (useRouter as jest.Mock).mockReturnValue({
      isReady: true,
      replace,
    });

    (useAuthentication as jest.Mock).mockReturnValue({
      isLoaded: true,
      user: {},
    });

    const root = render(
      <AuthenticatedPage>
        <div>Test</div>
      </AuthenticatedPage>
    );

    expect(root.container.childNodes.length).toBe(1);
    expect(root.getByText("Test")).toBeInTheDocument();
  });
});
