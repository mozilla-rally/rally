/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import fs from "fs";
import os from "os";
import minimist from "minimist";
import { spawn } from "child_process";

import { By, until, WebDriver } from "selenium-webdriver";
import { findAndAct, getChromeDriver, getFirefoxDriver, extensionLogsPresent, WAIT_FOR_PROPERTY, readCSVData } from "./utils";

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

describe("Facebook Pixel Hunt", function () {
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

    if (loadExtension) {
      // If installed, the extension will open its options page automatically.
      await driver.wait(async () => {
        return (await driver.getAllWindowHandles()).length === 2;
      }, WAIT_FOR_PROPERTY);
      await driver.switchTo().window((await driver.getAllWindowHandles())[1])
      await driver.wait(until.titleIs("Facebook Pixel Hunt"), WAIT_FOR_PROPERTY);
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

  it("enables and disables study", async function () {
    const statusElement = await driver.findElement(By.id("status"));

    await driver.wait(
      until.elementTextIs(statusElement, "Paused"),
      WAIT_FOR_PROPERTY
    );
    // Selenium seems to think this is not clickable, likely the CSS toggle-button technique we are using.
    // TODO make sure there aren't any accessibility issues with this.
    await driver.executeScript(`document.getElementById("toggleEnabled").click()`);
    await driver.wait(
      until.elementTextIs(statusElement, "Running"),
      WAIT_FOR_PROPERTY
    );
    await extensionLogsPresent(driver, testBrowser, [/Rally SDK - dev mode, resuming study/]);
    await driver.executeScript(`document.getElementById("toggleEnabled").click()`);

    await driver.wait(
      until.elementTextIs(statusElement, "Paused"),
      WAIT_FOR_PROPERTY
    );
    await extensionLogsPresent(driver, testBrowser, [/Rally SDK - dev mode, pausing study/]);
  });

  it("collects and exports data", async function () {

    await driver.wait(
      until.elementTextIs(driver.findElement(By.id("status")), "Paused"),
      WAIT_FOR_PROPERTY
    );
    await extensionLogsPresent(driver, testBrowser, [/Rally SDK - dev mode, resuming study/]);

    await driver.executeScript(`document.getElementById("toggleEnabled").click()`);
    const statusElement = await driver.findElement(By.id("status"));
    await driver.wait(
      until.elementTextIs(statusElement, "Running"),
      WAIT_FOR_PROPERTY
    );

    // Collect some data locally by browsing the archived test set.
    const originalTab = (await driver.getAllWindowHandles())[1];

    // First, visit a page with a plain, old-style <img> tag, which should trigger an HTTP GET.
    await driver.switchTo().newWindow("tab");
    await driver.get(`${BASE_URL}/img.html`);
    await driver.wait(until.titleIs(`Pixel Test (image) Complete`), WAIT_FOR_PROPERTY);
    await driver.navigate().refresh();
    await driver.close();

    await driver.switchTo().window(originalTab);
    await driver.wait(until.titleIs("Facebook Pixel Hunt"), WAIT_FOR_PROPERTY);

    // Next, watch for JS-generated HTTP POST.
    await driver.switchTo().newWindow("tab");
    await driver.get(`${BASE_URL}/js.html`);
    await driver.wait(until.titleIs(`Pixel Test (JS) Complete`), WAIT_FOR_PROPERTY);
    await driver.navigate().refresh();
    await driver.close();

    await driver.switchTo().window(originalTab);
    await driver.wait(until.titleIs("Facebook Pixel Hunt"), WAIT_FOR_PROPERTY);

    // Finally, open the index page, which should not fire any trackers.
    await driver.switchTo().newWindow("tab");
    await driver.get(`${BASE_URL}/`);
    await driver.wait(until.titleIs(`Pixel Test Index`), WAIT_FOR_PROPERTY);
    await driver.close();

    await driver.switchTo().window(originalTab);
    await driver.wait(until.titleIs("Facebook Pixel Hunt"), WAIT_FOR_PROPERTY);

    // Selenium does not work well with system dialogs like the download dialog.
    // TODO enable auto-download for Chrome, which needs to be done per-browser.
    // Our `getDriver` will do the right thing for Firefox, which just skips the dialog and
    // downloads the file to our tmpdir.
    await findAndAct(driver, By.id("download"), e => e.click());


    const pixelRecords = await readCSVData(`${tmpDir}/facebook-pixel-hunt-pixels.csv`);
    const navRecords = await readCSVData(`${tmpDir}/facebook-pixel-hunt-pageNavigations.csv`);

    // Cleanup any downloaded files. We do this before running tests, so if any
    // tests fail, cleanup is already done.
    for (const name of ["pixels", "pageNavigations"]) {
      await fs.promises.access(`${tmpDir}/facebook-pixel-hunt-${name}.csv`);
      await fs.promises.rm(`${tmpDir}/facebook-pixel-hunt-${name}.csv`);
    }


    /**
     * Convert a csv-parse record to an object which maps keys to arrays of rows.
     */
    function recordToObject(records) {
      let headers;
      let result = {};
      for (const [i, row] of Object.entries(records)) {
        if (parseInt(i) === 0) {
          headers = row;
        } else {
          for (const [j, entry] of Object.entries(row)) {
            const header = headers[j];
            if (header in result) {
              result[header].push(entry);
            } else {
              result[header] = [entry];
            }
          }
        }
      }
      return result;
    }

    // Run some data integrity tests on the output.
    const navData = recordToObject(navRecords);
    const pixelData = recordToObject(pixelRecords);

    const totalPages = 2;
    let pages = 0;
    for (let i: number; i < totalPages; i++) {
      expect(navData["pageId"][i]).toBe(pixelData["pageId"][i]);
      if (navData["url"][i] === `${BASE_URL}/img.html`) {
        // If this is an image pixel, the query string will be part of the URL, and there will be no formData
        expect(pixelData["url"][i]).toBe(`${BASE_URL}/tr?id=12345%20%20%20%20%20%20%20%20&ev=ViewContent%20%20%20%20%20%20%20%20&cd[content_name]=ABC%20Leather%20Sandal%20%20%20%20%20%20%20%20&cd[content_category]=Shoes%20%20%20%20%20%20%20%20&cd[content_type]=product%20%20%20%20%20%20%20%20&cd[content_ids]=1234%20%20%20%20%20%20%20%20&cd[value]=0.50%20%20%20%20%20%20%20%20&cd[currency]=USD`);

        expect(navData["url"][i]).toBe(`${BASE_URL}/img.html`);
        expect(pixelData["formData"][i]).toBe("undefined");
      } else if (navData["url"][i] === `${BASE_URL}/js.html`) {
        // the JS-generated pixel will have no query string in the URL, and will have data present in the formData field.
        expect(pixelData["url"][i]).toBe(`${BASE_URL}/tr`);
        expect(navData["url"][i]).toBe(`${BASE_URL}/js.html`);
        expect(pixelData["formData"][1]).toBe("abc=def&ghi=jkl");
      } else {
        throw new Error(`unknown url: ${navData["url"][i]}`);
      }
      pages++;
    }
    expect(pages).toBe(totalPages);

    await driver.executeScript(`document.getElementById("toggleEnabled").click()`);
    await driver.wait(
      until.elementTextIs(driver.findElement(By.id("status")), "Paused"),
      WAIT_FOR_PROPERTY
    );
    await extensionLogsPresent(driver, testBrowser, [/Rally SDK - dev mode, pausing study/]);
  });
});
