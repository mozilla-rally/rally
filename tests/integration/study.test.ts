/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import fs from "fs";
import os from "os";
import minimist from "minimist";
import { spawn } from "child_process";

import { By, until, WebDriver } from "selenium-webdriver";
import { findAndAct, getChromeDriver, getFirefoxDriver, extensionLogsPresent, WAIT_FOR_PROPERTY } from "./utils";

const args = (minimist(process.argv.slice(2)));
for (const arg of ["test_browser", "load_extension", "headless_mode"]) {
  if (!(arg in args)) {
    throw new Error(`Missing required option: --${arg}`);
  }
}

const testBrowser = args["test_browser"];
const loadExtension = args["load_extension"] === "true";
const headlessMode = args["headless_mode"] === "true";

export let getDriver: Function;
switch (testBrowser) {
  case "chrome":
    getDriver = getChromeDriver;
    break;
  case "firefox":
    getDriver = getFirefoxDriver;
    break;
  default:
    throw new Error(`Unknown test_browser: ${testBrowser}`);
}

console.info(
  `Running with test_browser: ${testBrowser}, load_extension: ${loadExtension}, headless_mode: ${headlessMode}`
);

// Wait ten minutes overall before Jest times the test out.
jest.setTimeout(60 * 10000);

let tmpDir: string;
let driver: WebDriver;
let screenshotCount = 0;
let server;

let logWindow;
let testWindow;

const PORT = "8000";
const BASE_URL = `http://localhost:${PORT}`;
const PATH = "tests/integration/webarchive/localhost";

/**
 * Switch to the original window and wait for log to match regexp.
 * Needed for Chrome, since Selenium can only access web content logs.
 *
 * @param matches
 */
async function waitForLogs(matches: RegExp[]) {
  // Preserve handle to current test window.
  const testWindow = await driver.getWindowHandle();

  // Switch to original window to read logs.
  await driver.switchTo().window(logWindow);

  // Wait until log message is present, or time out.
  await driver.wait(
    async () =>
      await extensionLogsPresent(
        driver,
        testBrowser,
        matches
      ),
    WAIT_FOR_PROPERTY
  );

  // Restore focus to test window.
  await driver.switchTo().window(testWindow);
}

describe("Rally Study Template", function () {
  beforeAll(async () => {
    server = spawn("http-server", [PATH, "-p", PORT]);
    console.debug(`Test server running on port ${PORT}`);
  });

  afterAll(async () => {
    server.kill();
    console.debug(`Test server stopped on port ${PORT}`);
  });

  beforeEach(async () => {
    tmpDir = os.tmpdir();
    console.info("Using tmpdir:", tmpDir);
    driver = await getDriver(loadExtension, headlessMode, tmpDir);

    /*
    // Start a new window to collect logs from the extension, the original will be used to run tests.
    // Selenium is currently not able to access Chrome extension logs directly, so they are messaged to the
    // original window.
    testWindow = await driver.getWindowHandle();

    await driver.switchTo().newWindow('window');
    await driver.get("http://localhost:8000");
    logWindow = await driver.getWindowHandle();
    */
    if (loadExtension) {
      // If installed, the extension will open its options page automatically.
      // await driver.switchTo().window(testWindow);
      if (testBrowser === "chrome") {
        await driver.wait(async () => {
          return (await driver.getAllWindowHandles()).length === 2;
        }, WAIT_FOR_PROPERTY);
      }
      await driver.switchTo().window((await driver.getAllWindowHandles())[0])
      await driver.wait(until.titleIs("Rally Study Template"), WAIT_FOR_PROPERTY);
    }
  });

  afterEach(async () => {
    screenshotCount++;

    const image = await driver.takeScreenshot();
    let extension = loadExtension ? "extension" : "no_extension";
    let headless = headlessMode ? "headless" : "no_headless";

    const screenshotDir = `screenshots/${testBrowser}-${extension}-${headless}`;
    const screenshotFilename = `${screenshotDir}/out-${screenshotCount}.png`;
    try {
      await fs.promises.access(`./${screenshotDir}`);
    } catch (ex) {
      await fs.promises.mkdir(`./${screenshotDir}`);
    }
    await fs.promises.writeFile(screenshotFilename, image, "base64");
    console.log(`recorded screenshot: ${screenshotFilename}`);

    await driver.quit();
  });

  it("is a minimal test case", async function () { });
});
