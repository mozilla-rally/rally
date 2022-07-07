import { assert } from "assert";
import { useEffect } from "react";

import {
  CurrencyFormatter,
  IFormatter,
  NumberFormatter,
  useFormatter,
} from "../InputValueFormatters";

jest.mock("react");

describe("useFormatter tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("null test", () => {
    const invalidFormatter: IFormatter = {
      getEditableValue: jest.fn().mockImplementation(() => {
        assert(false, "getEditableValue");
      }),
      getFormattedValue: jest.fn().mockImplementation(() => {
        assert(false, "getFormattedValue");
      }),
    };

    const ref = { current: null };

    expect(() => useFormatter(ref, invalidFormatter)).not.toThrow();

    expect(() => invokeUseEffect()).not.toThrow();
  });

  it("zero state", () => {
    const inputElement = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    } as unknown as HTMLInputElement;

    const formatter: IFormatter = {
      getEditableValue: jest.fn().mockImplementation(() => {
        return "getEditableValue";
      }),
      getFormattedValue: jest.fn().mockImplementation(() => {
        return "getFormattedValue";
      }),
    };

    useFormatter({ current: inputElement }, formatter);

    const unsubscribe = invokeUseEffect();

    assertEventSubscription(inputElement);

    expect(inputElement.value).toBe("getFormattedValue");

    expect(formatter.getFormattedValue).toHaveBeenCalledWith("");

    expect(formatter.getEditableValue).not.toHaveBeenCalled();

    invokeEvent(inputElement, "focus");

    expect(inputElement.value).toBe("getEditableValue");

    expect(formatter.getEditableValue).toHaveBeenCalledWith(
      "getFormattedValue"
    );

    expect(inputElement.removeEventListener).not.toHaveBeenCalled();

    unsubscribe();

    assertEventUnsubscription(inputElement);
  });

  it("handles focussing on empty value", () => {
    const inputElement = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    } as unknown as HTMLInputElement;

    const formatter: IFormatter = {
      getEditableValue: jest.fn().mockImplementation(() => {
        return "getEditableValue";
      }),
      getFormattedValue: jest.fn().mockImplementation(() => {
        return "getFormattedValue";
      }),
    };

    useFormatter({ current: inputElement }, formatter);

    invokeUseEffect();

    inputElement.value = "";

    invokeEvent(inputElement, "focus");

    expect(formatter.getEditableValue).toHaveBeenCalledWith("");
  });

  it("formats values on losing focus", () => {
    const inputElement = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    } as unknown as HTMLInputElement;

    const formatter: IFormatter = {
      getEditableValue: jest.fn().mockImplementation(() => {
        return "getEditableValue";
      }),
      getFormattedValue: jest.fn().mockImplementation(() => {
        return "getFormattedValue";
      }),
    };

    useFormatter({ current: inputElement }, formatter);

    invokeUseEffect();

    inputElement.value = "raw value";

    invokeEvent(inputElement, "blur");

    expect(formatter.getFormattedValue).toHaveBeenCalledWith("raw value");
  });

  function invokeUseEffect() {
    expect(useEffect).toHaveBeenCalled();

    return (useEffect as jest.Mock).mock.calls[0][0]();
  }

  function invokeEvent(inputElement: HTMLInputElement, eventName: string) {
    const calls = (inputElement.addEventListener as jest.Mock).mock.calls;
    const call = calls.find((call) => call[0] === eventName);

    expect(call).toBeDefined();
    call[1]();
  }

  function assertEventSubscription(inputElement: HTMLInputElement) {
    ["input", "focus", "blur"].forEach((eventName) =>
      expect(inputElement.addEventListener).toHaveBeenCalledWith(
        eventName,
        expect.anything()
      )
    );
  }

  function assertEventUnsubscription(inputElement: HTMLInputElement) {
    ["input", "focus", "blur"].forEach((eventName) =>
      expect(inputElement.removeEventListener).toHaveBeenCalledWith(
        eventName,
        expect.anything()
      )
    );
  }
});

describe("NumberFormatter tests", () => {
  describe("getEditableValue", () => {
    it("handles null case", () => {
      expect(NumberFormatter.getEditableValue(null as unknown as string)).toBe(
        ""
      );
    });

    it("handles currency integer values", () => {
      expect(NumberFormatter.getEditableValue("$1234")).toBe("1234");
    });

    it("handles all non-integers", () => {
      expect(NumberFormatter.getEditableValue("A1B2C3D4E")).toBe("1234");
    });
  });

  describe("getFormattedValue", () => {
    it("handles null case", () => {
      expect(NumberFormatter.getFormattedValue(null as unknown as string)).toBe(
        ""
      );
    });

    it("handles currency integer values", () => {
      expect(NumberFormatter.getEditableValue("$1234")).toBe("1234");
    });
  });
});

describe("CurrencyFormatter tests", () => {
  it("handles null case", () => {
    expect(CurrencyFormatter.getFormattedValue(null as unknown as string)).toBe(
      ""
    );
  });

  it("handles non integers", () => {
    expect(CurrencyFormatter.getFormattedValue("abcd")).toBe("");
  });

  it("handles all non-integers", () => {
    expect(CurrencyFormatter.getFormattedValue("A1B2C3D4E")).toBe("$1,234");
  });
});
