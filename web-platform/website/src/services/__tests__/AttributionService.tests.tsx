import { RenderResult, act, render } from "@testing-library/react";

import {
  AttributionDataContext,
  AttributionProvider,
  useAttribution,
} from "../AttributionService";
import { useAuthentication } from "../AuthenticationService";
import { useUserDocument } from "../UserDocumentService";

jest.mock("../AuthenticationService");
jest.mock("../UserDocumentService");

const attributionQueryString =
  "?utm_source=test-source" +
  "&utm_medium=test-medium" +
  "&utm_campaign=test-campaign" +
  "&utm_term=test-term" +
  "&utm_content=test-content";

const attribution = {
  utm_source: "test-source",
  utm_medium: "test-medium",
  utm_campaign: "test-campaign",
  utm_term: "test-term",
  utm_content: "test-content",
};

describe("AttributionService tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it("loads the attribution codes correctly when not logged in", async () => {
    const updateUserDocument = jest.fn();

    (useAuthentication as jest.Mock).mockReturnValue({
      user: { tokenId: true },
    });

    (useUserDocument as jest.Mock).mockReturnValue({
      userDocument: {
        enrolled: false,
        updateUserDocument,
      },
    });

    let attributionContext: AttributionDataContext =
      null as unknown as AttributionDataContext;

    function Component() {
      attributionContext = useAttribution();
      return null;
    }

    Object.defineProperty(window, "location", {
      value: {
        href: `https://example.com/${attributionQueryString}`,
      },
    });

    jest.spyOn(Storage.prototype, "getItem");

    const renderedComponent = (
      <AttributionProvider>
        <Component />
      </AttributionProvider>
    );

    let root = null as unknown as RenderResult;

    await act(async () => {
      root = render(renderedComponent);
    });

    const testUrl = new URL("https://example.com");

    // No attribution codes in local storage, should be pulled from the URL in window.location
    attributionContext.setAttributionCodes(testUrl);
    expect(attributionContext).not.toBeNull();

    jest.spyOn(Storage.prototype, "setItem");

    await act(async () => {
      root = render(renderedComponent);
    });

    expect(localStorage.getItem).toHaveBeenCalledWith("rally_utm");
    expect(updateUserDocument).not.toHaveBeenCalled();

    // Attribution codes already present in local storage
    Storage.prototype.getItem = jest.fn((name) => {
      if (name === "rally_utm") {
        return { utm_source: "test" };
      }
    });
    const resultLocalStorageOverrides =
      attributionContext.setAttributionCodes(testUrl);
    expect(attributionContext).not.toBeNull();

    expect(resultLocalStorageOverrides.href).toEqual(
      `https://example.com/?utm_source=test`
    );

    expect(localStorage.getItem).toHaveBeenCalledWith("rally_utm");

    await act(async () => {
      root.unmount();
    });
  });

  it("loads the attribution codes correctly when logged in", async () => {
    const updateUserDocument = jest.fn();

    (useUserDocument as jest.Mock).mockReturnValue({
      isDocumentLoaded: true,
      userDocument: { enrolled: true },
      updateUserDocument,
    });

    (useAuthentication as jest.Mock).mockReturnValue({
      user: { tokenId: true },
    });

    let attributionContext: AttributionDataContext =
      null as unknown as AttributionDataContext;

    function Component() {
      attributionContext = useAttribution();
      return null;
    }

    Object.defineProperty(window, "location", {
      value: {
        href: `https://example.com/${attributionQueryString}`,
      },
    });

    jest.spyOn(Storage.prototype, "getItem");

    const renderedComponent = (
      <AttributionProvider>
        <Component />
      </AttributionProvider>
    );

    let root = null as unknown as RenderResult;

    await act(async () => {
      root = render(renderedComponent);
    });

    const testUrl = new URL("https://example.com");

    // Attribution codes in Firestore, query string does not override.
    const result = attributionContext.setAttributionCodes(testUrl);
    expect(attributionContext).not.toBeNull();
    expect(result.href).toEqual(`https://example.com/`);

    expect(localStorage.getItem).toHaveBeenCalledWith("rally_utm");
    expect(updateUserDocument).toHaveBeenCalledTimes(1);

    // Attribution codes already present in local storage.
    Storage.prototype.getItem = jest.fn((name) => {
      if (name === "rally_utm") {
        return { utm_source: "test" };
      }
    });

    const result2 = attributionContext.setAttributionCodes(testUrl);
    expect(attributionContext).not.toBeNull();
    expect(result2.href).toEqual(`https://example.com/?utm_source=test`);

    expect(localStorage.getItem).toHaveBeenCalledWith("rally_utm");

    await act(async () => {
      root.unmount();
    });
  });
});
