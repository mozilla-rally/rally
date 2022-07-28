import { BrowserType } from "./BrowserType";

export function detectBrowser(): BrowserType {
  // Firefox 1.0+
  // @ts-ignore Ref: https://stackoverflow.com/questions/49328382/browser-detection-in-reactjs
  if (typeof InstallTrigger !== "undefined") {
    return BrowserType.FireFox;
  }

  // Chrome 1 - 71
  if (
    // @ts-ignore Ref: https://stackoverflow.com/questions/49328382/browser-detection-in-reactjs
    window.chrome
  ) {
    return BrowserType.Chrome;
  }

  return BrowserType.Unknown;
}
