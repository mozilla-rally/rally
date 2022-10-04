import { act, render } from "@testing-library/react";

import {
  FlagProvider,
  FlagServiceDataContext,
  useFlagService,
} from "../FlagService";

describe("FlagService tests", () => {
  it("correctly deserializes flags", async () => {
    const flags = { a: true, b: true, c: false, d: true };

    jest
      .spyOn(Storage.prototype, "getItem")
      .mockReturnValue(JSON.stringify(flags));

    const flagContext: FlagServiceDataContext = await getFlagsContext();

    expect(flagContext.isFlagActive("a")).toBeTruthy();
    expect(flagContext.isFlagActive("b")).toBeTruthy();
    expect(flagContext.isFlagActive("c")).toBeFalsy();
    expect(flagContext.isFlagActive("d")).toBeTruthy();
  });

  it("non existent flags", async () => {
    jest.spyOn(Storage.prototype, "getItem").mockReturnValue("  ");

    const flagContext: FlagServiceDataContext = await getFlagsContext();
    expect(flagContext.isFlagActive("a")).toBeFalsy();
  });

  it("sets a flag while persisting existing flags", async () => {
    const flags = { a: true, b: true, c: false, d: true };

    jest
      .spyOn(Storage.prototype, "getItem")
      .mockReturnValue(JSON.stringify(flags));

    jest.spyOn(Storage.prototype, "setItem");

    const flagContext: FlagServiceDataContext = await getFlagsContext();

    expect(flagContext.setFlag("b", false));
    expect(flagContext.setFlag("c", true));

    expect(Storage.prototype.setItem).toHaveBeenCalledWith(
      "flags",
      JSON.stringify({ a: true, c: false, d: true })
    );

    // NOTE: getItem shall provide the same hardcoded object above and never read from disk
    expect(Storage.prototype.setItem).toHaveBeenCalledWith(
      "flags",
      JSON.stringify({ a: true, b: true, c: true, d: true })
    );
  });

  async function getFlagsContext() {
    let flagContext: FlagServiceDataContext | null = null;
    function Component() {
      flagContext = useFlagService();
      return null;
    }

    const renderedComponent = (
      <FlagProvider>
        <Component />
      </FlagProvider>
    );

    await act(async () => {
      render(renderedComponent);
    });

    return flagContext as unknown as FlagServiceDataContext;
  }
});
