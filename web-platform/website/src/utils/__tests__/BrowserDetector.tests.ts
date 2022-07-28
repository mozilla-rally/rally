import { detectBrowser } from "../BrowserDetector";
import { BrowserType } from "../BrowserType";

describe("BrowserDetector tests", () => {
  beforeEach(() => {
    cleanUp();
  });

  afterEach(() => {
    cleanUp();
  });

  it("detects unknown browser", () => {
    expect(detectBrowser()).toBe(BrowserType.Unknown);
  });

  it("detects firefox", () => {
    const globalInstance = global as Record<string, unknown>;
    globalInstance.InstallTrigger = Date; // Any type other than undefined would do

    expect(detectBrowser()).toBe(BrowserType.FireFox);
  });

  it("detects chrome", () => {
    const globalInstance = global as Record<string, unknown>;
    globalInstance.chrome = {};

    expect(detectBrowser()).toBe(BrowserType.Chrome);
  });

  function cleanUp() {
    const globalInstance = global as Record<string, unknown>;
    delete globalInstance.InstallTrigger;
    delete globalInstance.chrome;
  }
});
