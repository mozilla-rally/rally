import { render } from "@testing-library/react";
import { logEvent } from "firebase/analytics";
import { Router, useRouter } from "next/router";

import { default as App } from "../pages/_app";
import { AttributionProvider } from "../services/AttributionService";
import { AuthenticationProvider } from "../services/AuthenticationService";
import { useFirebase } from "../services/FirebaseService";
import { FlagProvider } from "../services/FlagService";
import { StudiesProvider } from "../services/StudiesService";
import { UserDocumentProvider } from "../services/UserDocumentService";

jest.mock("firebase/analytics");
jest.mock("next/router");
jest.mock("../services/AuthenticationService");
jest.mock("../services/FirebaseService");
jest.mock("../services/FlagService");
jest.mock("../services/StudiesService");
jest.mock("../services/UserDocumentService");
jest.mock("../services/AttributionService");

describe("App tests", () => {
  const analytics = { analytics: "analytics" };

  beforeEach(() => {
    (FlagProvider as jest.Mock).mockImplementation(({ children }) => children);

    (AuthenticationProvider as jest.Mock).mockImplementation(
      ({ children }) => children
    );

    (StudiesProvider as jest.Mock).mockImplementation(
      ({ children }) => children
    );

    (UserDocumentProvider as jest.Mock).mockImplementation(
      ({ children }) => children
    );

    (AttributionProvider as jest.Mock).mockImplementation(
      ({ children }) => children
    );

    (useFirebase as jest.Mock).mockReturnValue({ analytics });
  });

  it("renders components correctly when route is not ready", () => {
    const router = {
      isReady: false,
      events: {
        on: jest.fn(),
      },
    };

    (useRouter as jest.Mock).mockReturnValue(router);

    assertRenderContent();

    expect(router.events.on).not.toHaveBeenCalled();
  });

  it("renders components correctly and logs page events", () => {
    const router = {
      isReady: true,
      pathname: "/",
      events: {
        on: jest.fn(),
      },
    };

    (useRouter as jest.Mock).mockReturnValue(router);

    assertRenderContent();

    expect(logEvent).toHaveBeenCalledWith(analytics, "page_view", {
      page_path: router.pathname,
    });

    (logEvent as jest.Mock).mockReset();

    expect(router.events.on).toHaveBeenCalledWith(
      "routeChangeComplete",
      expect.anything()
    );

    router.pathname = "/studies";

    router.events.on.mock.calls[0][1]();

    expect(logEvent).toHaveBeenCalledWith(analytics, "page_view", {
      page_path: router.pathname,
    });
  });

  function assertRenderContent() {
    const root = render(
      <App
        Component={(props) => (
          <div>{`Hello ${(props as { name: string }).name}`}</div>
        )}
        pageProps={{ name: "World" }}
        router={{} as Router}
      />
    );

    expect(root.getByText("Hello World")).toBeInTheDocument();

    expect(FlagProvider).toHaveBeenCalled();
    expect(AuthenticationProvider).toHaveBeenCalled();
    expect(UserDocumentProvider).toHaveBeenCalled();
    expect(AttributionProvider).toHaveBeenCalled();
    expect(StudiesProvider).toHaveBeenCalled();

    expect(useFirebase).toHaveBeenCalled();
    expect(useRouter).toHaveBeenCalled();
  }
});
