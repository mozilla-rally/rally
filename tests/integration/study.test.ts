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


});
