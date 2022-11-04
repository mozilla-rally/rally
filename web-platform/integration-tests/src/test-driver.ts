import * as minimist from "minimist";
import { Builder, logging, WebDriver } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import firefox from "selenium-webdriver/firefox";

interface GlobalDriver {
  type: "chrome" | "firefox";
  isHeadless: boolean;
  driver: Promise<WebDriver>;
}

export function create() {
  const args = minimist(process.argv.slice(2), {
    boolean: ["headless_mode"],
    string: ["browser_type"],
  });

  for (const arg of ["browser_type", "headless_mode"]) {
    if (!(arg in args)) {
      throw new Error(`Missing required option: --${arg}`);
    }
  }

  const browserType = args["browser_type"];

  const isChrome = browserType === "chrome";
  const isFirefox = browserType === "firefox";

  const isHeadless = args["headless_mode"];

  if (!isChrome && !isFirefox) {
    throw new Error("Invalid browser type.");
  }

  return {
    browser: {
      type: args["browser_type"],
      isHeadless: args["headless_mode"],
      driver:
        browserType === "chrome"
          ? getChromeDriver(isHeadless)
          : getFirefoxDriver(isHeadless),
    },
  };
}

export async function getWebdriver(): Promise<WebDriver> {
  return (global as unknown as { browser: GlobalDriver }).browser.driver;
}

/**
 * Get a Selenium driver for using the Chrome browser.
 *
 * @param {boolean} headlessMode
 *        Whether or not to run Firefox in headless mode.
 * @returns {Promise<WebDriver>} a WebDriver instance to control Chrome.
 */
async function getChromeDriver(headlessMode: boolean) {
  const chromeOptions = new chrome.Options();

  if (headlessMode) {
    throw new Error("Chrome Headless does not support extensions");
  }

  const loggingPrefs = new logging.Preferences();
  loggingPrefs.setLevel(logging.Type.BROWSER, logging.Level.ALL);

  if (headlessMode) {
    chromeOptions.headless();
    chromeOptions.addArguments("window-size=1920,1080");
  }

  return await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(chromeOptions)
    .setLoggingPrefs(loggingPrefs)
    .build();
}

/**
 * Get a Selenium driver for using the Firefox browser.
 *
 * @param {Boolean} headlessMode
 *        Whether or not to run Firefox in headless mode.
 * @returns {Promise<WebDriver>} a WebDriver instance to control Firefox.
 */
async function getFirefoxDriver(headlessMode: boolean): Promise<WebDriver> {
  const firefoxOptions = new firefox.Options();
  firefoxOptions.setPreference("devtools.console.stdout.content", true);

  if (headlessMode) {
    firefoxOptions.headless();
    firefoxOptions.addArguments("-width=1920", "-height=1080");
  }

  const driver = await new Builder()
    .forBrowser("firefox")
    .setFirefoxOptions(firefoxOptions)
    .setFirefoxService(new firefox.ServiceBuilder().setStdio("inherit"))
    .build();

  return driver;
}
