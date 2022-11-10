import * as minimist from "minimist";
import {
  Builder,
  logging,
  Locator,
  WebDriver,
  until,
  WebElement,
  By,
} from "selenium-webdriver";
import { Options as ChromeOptions } from "selenium-webdriver/chrome";
import {
  Options as FirefoxOptions,
  ServiceBuilder,
} from "selenium-webdriver/firefox";

interface GlobalDriver {
  type: "chrome" | "firefox";
  isHeadless: boolean;
}

let driverInfo: GlobalDriver;
export function initializeEnvironment() {
  if (driverInfo) {
    throw new Error("Duplicate initialization.");
  }

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

  driverInfo = {
    type: args["browser_type"],
    isHeadless: isHeadless,
  };
}

let driver: Promise<WebDriver> | undefined;
export async function getWebdriver(): Promise<WebDriver> {
  if (driver) {
    return driver;
  }

  const { type, isHeadless } = driverInfo;

  driver =
    type === "chrome"
      ? getChromeDriver(isHeadless)
      : getFirefoxDriver(isHeadless);

  return driver;
}

/**
 * Get a Selenium driver for using the Chrome browser.
 *
 * @param {boolean} headlessMode
 *        Whether or not to run Firefox in headless mode.
 * @returns {Promise<WebDriver>} a WebDriver instance to control Chrome.
 */
async function getChromeDriver(headlessMode: boolean) {
  const chromeOptions = new ChromeOptions();

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
  const firefoxOptions = new FirefoxOptions();
  firefoxOptions.setPreference("devtools.console.stdout.content", true);

  if (headlessMode) {
    firefoxOptions.headless();
    firefoxOptions.addArguments("-width=1920", "-height=1080");
  }

  const driver = await new Builder()
    .forBrowser("firefox")
    .setFirefoxOptions(firefoxOptions)
    .setFirefoxService(new ServiceBuilder().setStdio("inherit"))
    .build();

  return driver;
}

// The number of milliseconds to wait for some
// property to change in tests. This should be
// a long time to account for slow CI.
export const WAIT_FOR_PROPERTY = 10000;

export async function clickElementByText(text: string) {
  await findAndAct(locateElementByText(text), async (e) => {
    await e.click();
  });
}

export async function clickElementById(id: string) {
  await findAndAct(By.id(id), async (e) => {
    await e.click();
  });
}

export function locateElementByText(text: string): Locator {
  return By.xpath('//div[contains(text(), "' + text + '")]');
}

/**
 * Find the element and perform an action on it.
 *
 * @param {Locator} locator
 *        The locator for an element to look for and execute actions on.
 * @param {Function} action
 *        A function in the form `e => {}` that will be called
 *        and receive the element once ready.
 */
export async function findAndAct(
  locator: Locator,
  action: (element: WebElement) => Promise<void>
) {
  const driver = await getWebdriver();

  await driver.wait(async () => {
    try {
      const element = await driver.findElement(locator);

      await driver.wait(until.elementIsEnabled(element), WAIT_FOR_PROPERTY);
      await driver.wait(until.elementIsVisible(element), WAIT_FOR_PROPERTY);

      await action(element);
      return true;
    } catch (e) {
      const ex = e as { name: string; message: string };

      console.debug(
        `Element at locator ${locator} not ready when expected, retrying: ${ex.name}, ${ex.message}`
      );
      return false;
    }
  }, WAIT_FOR_PROPERTY);
}
