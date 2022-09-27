import { RenderResult, act, render } from "@testing-library/react";

import {
  AttributionDataContext,
  AttributionProvider,
  useAttribution,
} from "../AttributionService";

const attributionQueryString =
  "?utm_source=test-source" +
  "&utm_medium=test-medium" +
  "&utm_campaign=test-campaign" +
  "&utm_term=test-term" +
  "&utm_content=test-content";

describe("AttributionService tests", () => {
  it("loads the attribution codes correctly", async () => {
    let attributionContext: AttributionDataContext =
      null as unknown as AttributionDataContext;

    function Component() {
      attributionContext = useAttribution();
      return null;
    }

    Object.defineProperty(window, 'location', {
      value: {
        href: `https://example.com/${attributionQueryString}`
      }
    });

    jest.spyOn(Storage.prototype, 'getItem');

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
    const result = attributionContext.setAttributionCodes(testUrl);
    expect(attributionContext).not.toBeNull();
    expect(result.href).toEqual(`https://example.com/${attributionQueryString}`);

    expect(localStorage.getItem).toHaveBeenCalledWith("rally_utm");

    // Attribution codes already present in local storage.
    Storage.prototype.getItem = jest.fn(
      (name) => {
        if (name === "rally_utm") {
          return { utm_source: "test" };
        }
      }
    );
    const result2 = attributionContext.setAttributionCodes(testUrl);
    expect(attributionContext).not.toBeNull();
    expect(result2.href).toEqual(`https://example.com/?utm_source=test`);

    expect(localStorage.getItem).toHaveBeenCalledWith("rally_utm");



    await act(async () => {
      root.unmount();
    });
  });
});
