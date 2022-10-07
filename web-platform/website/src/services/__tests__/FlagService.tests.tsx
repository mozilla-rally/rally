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

    expect(
      flagContext.isFlagActive({
        name: "a",
        description: "a",
        defaultValue: false,
      })
    ).toBeTruthy();

    expect(
      flagContext.isFlagActive({
        name: "b",
        description: "b",
        defaultValue: true,
      })
    ).toBeTruthy();

    expect(
      flagContext.isFlagActive({
        name: "c",
        description: "c",
        defaultValue: true,
      })
    ).toBeFalsy();

    expect(
      flagContext.isFlagActive({
        name: "d",
        description: "d",
        defaultValue: false,
      })
    ).toBeTruthy();
  });

  it("non existent flags - default value false", async () => {
    jest.spyOn(Storage.prototype, "getItem").mockReturnValue("  ");

    const flagContext: FlagServiceDataContext = await getFlagsContext();

    expect(
      flagContext.isFlagActive({
        name: "a",
        description: "a",
        defaultValue: false,
      })
    ).toBeFalsy();
  });

  it("non existent flags - default value true", async () => {
    jest.spyOn(Storage.prototype, "getItem").mockReturnValue("  ");

    const flagContext: FlagServiceDataContext = await getFlagsContext();

    expect(
      flagContext.isFlagActive({
        name: "a",
        description: "a",
        defaultValue: true,
      })
    ).toBeTruthy();
  });

  it("sets a flag while persisting existing flags", async () => {
    const flags = { a: true, b: true, c: false, d: true };

    jest
      .spyOn(Storage.prototype, "getItem")
      .mockReturnValue(JSON.stringify(flags));

    jest.spyOn(Storage.prototype, "setItem");

    const flagContext: FlagServiceDataContext = await getFlagsContext();

    expect(
      flagContext.setFlag(
        {
          name: "b",
          description: "b",
          defaultValue: false,
        },
        false
      )
    );

    expect(
      flagContext.setFlag(
        {
          name: "c",
          description: "c",
          defaultValue: true,
        },
        true
      )
    );

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
