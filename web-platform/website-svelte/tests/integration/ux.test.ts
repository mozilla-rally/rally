/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import fs, { createReadStream } from "fs";
import minimist from "minimist";
import readline from "readline";
import { By, until, WebDriver } from "selenium-webdriver";
import {
  extensionLogsPresent, findAndAct,
  getChromeDriver,
  getFirefoxDriver, WAIT_FOR_PROPERTY
} from "./utils";


const args = minimist(process.argv.slice(2));
console.debug(args);
for (const arg of ["test_browser", "load_extension", "headless_mode"]) {
  if (!(arg in args)) {
    throw new Error(`Missing required option: --${arg}`);
  }
}

const testBrowser = args["test_browser"];
const loadExtension = args["load_extension"] === "true";
const headlessMode = args["headless_mode"] === "true";

export let webDriver;
switch (testBrowser) {
  case "chrome":
    webDriver = getChromeDriver;
    break;
  case "firefox":
    webDriver = getFirefoxDriver;
    break;
  default:
    throw new Error(`Unknown test_browser: ${testBrowser}`);
}

console.info(
  `Running with test_browser: ${testBrowser}, load_extension: ${loadExtension}, headless_mode: ${headlessMode}`
);

// Wait ten minutes overall before Jest times the test out.
jest.setTimeout(60 * 10000);

let driver: WebDriver;
let screenshotCount = 0;

describe("Rally Web Platform UX flows", function () {
  beforeEach(async () => {
    driver = await webDriver(loadExtension, headlessMode);

    // If installed, the extension will open this page.
    if (loadExtension) {
      // Starting with a single tab.
      await driver.wait(async () => {
        return (await driver.getAllWindowHandles()).length === 2;
      }, WAIT_FOR_PROPERTY);

      // Close the original tab, which is blank.
      await driver.switchTo().window((await driver.getAllWindowHandles())[0]);
      await driver.close();
      // Site is now open in first tab position.
      await driver.switchTo().window((await driver.getAllWindowHandles())[0]);
    } else {
      await driver.get("http://localhost:5000");
    }

    await driver.wait(
      until.titleIs("Sign Up | Mozilla Rally"),
      WAIT_FOR_PROPERTY
    );

    // Starting with a single tab.
    await driver.wait(async () => {
      return (await driver.getAllWindowHandles()).length === 1;
    }, WAIT_FOR_PROPERTY);
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

  it("signs into website and completes join/study tasks", async function () {
    await driver.wait(
      until.titleIs("Sign Up | Mozilla Rally"),
      WAIT_FOR_PROPERTY
    );
    await findAndAct(driver, By.css("button"), (e) => e.click());
    await findAndAct(driver, By.id("add-account-button"), (e) => e.click());
    await findAndAct(driver, By.id("autogen-button"), (e) => e.click());
    await findAndAct(driver, By.id("sign-in"), (e) => e.click());

    await driver.wait(
      until.titleIs("Privacy Policy | Mozilla Rally"),
      WAIT_FOR_PROPERTY
    );

    //scroll to page bottom
    await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);");
    //hide firebase emulator warning
    let fb = driver.findElement(By.css(".firebase-emulator-warning"));
    await driver.executeScript("arguments[0].id = 'fb'", fb);
    await driver.executeScript("document.getElementById('fb').style.visibility='hidden'");
    await driver.executeScript("document.getElementById('accept').style.position='relative'");
    await driver.executeScript("document.getElementById('accept').style.top='-5rem'");

    // NOTE: Clicking accept and enroll opens the extension page in chrome marketplace
    // and hence we must return focus to Rally website before proceeding with further testing

    const windowHandle = await driver.getWindowHandle();

    await findAndAct(
      driver,
      By.xpath('//button[text()="Accept & Enroll"]'),
      (e) => e.click()
    );

    // Switch back to Rally website
    await driver.switchTo().window(windowHandle);

    await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);");
    await driver.executeScript("arguments[0].id = 'fb'", fb);
    await driver.executeScript("document.getElementById('fb').style.visibility='hidden'");

    await findAndAct(driver, By.xpath('//button[text()="Skip for Now"]'), (e) =>
      e.click()
    );

    await driver.wait(
      until.titleIs("Studies | Mozilla Rally"),
      WAIT_FOR_PROPERTY
    );

    // Start to join study, but cancel.
    await findAndAct(driver, By.xpath('//button[text()="Join Study"]'), (e) =>
      e.click()
    );
    await findAndAct(driver, By.xpath('//button[text()="Cancel"]'), (e) =>
      e.click()
    );

    // Start to join study, and confirm.
    await findAndAct(driver, By.xpath('//button[text()="Join Study"]'), (e) =>
      e.click()
    );
    await findAndAct(
      driver,
      By.xpath('//button[text()="Add study extension"]'),
      (e) => e.click()
    );

    if (loadExtension) {
      // FIXME need to load Chrome-compatible study metadata into firestore.
      if (testBrowser === "firefox") {
        await driver.wait(
          async () =>
            await extensionLogsPresent(
              driver,
              testBrowser,
              `Start data collection`
            ),
          WAIT_FOR_PROPERTY
        );
      }
    } else {
      // Start to leave study, but cancel.
      await findAndAct(driver, By.className("update-dropdown-link"), (e) =>
        e.click()
      );

      await findAndAct(driver, By.xpath('//a[text()="Don\'t join this study"]'), (e) =>
        e.click()
      );

      await findAndAct(driver, By.xpath('//html'), (e) =>
        e.click()
      );

      // Start to leave study, and confirm.
      await findAndAct(driver, By.className("update-dropdown-link"), (e) =>
        e.click()
      );

      await findAndAct(driver, By.xpath('//a[text()="Don\'t join this study"]'), (e) =>
        e.click()
      );

      await findAndAct(
        driver,
        By.xpath('(//button[text()="Don\'t join this study"])'),
        (e) => e.click()
      );
    }
    if (loadExtension) {
      // Start to leave study, but cancel.
      await findAndAct(driver, By.className("update-dropdown-link"), (e) =>
        e.click()
      );

      await findAndAct(driver, By.xpath('//a[text()="Leave study"]'), (e) =>
        e.click()
      );

      await findAndAct(driver, By.xpath('//button[text()="Cancel"]'), (e) =>
        e.click()
      );

      // Start to leave study, and confirm.
      await findAndAct(driver, By.className("update-dropdown-link"), (e) =>
        e.click()
      );

      await findAndAct(driver, By.xpath('//a[text()="Leave study"]'), (e) =>
        e.click()
      );

      await findAndAct(
        driver,
        By.xpath('(//button[text()="Leave Study"])'),
        (e) => e.click()
      );
      // FIXME check for Chrome logs.
      if (testBrowser === "firefox") {
        await driver.wait(
          async () =>
            await extensionLogsPresent(
              driver,
              testBrowser,
              `Pause data collection`
            ),
          WAIT_FOR_PROPERTY
        );
      }
    }
  });

  it("fails to sign up for a new email account with invalid info", async function () {
    await driver.wait(
      until.titleIs("Sign Up | Mozilla Rally"),
      WAIT_FOR_PROPERTY
    );

    await findAndAct(driver, By.id("create"), (e) => e.click());

    // Invalid email address fails.
    await driver.findElement(By.id("id_user_email")).sendKeys("test123");
    await driver.findElement(By.id("id_user_pw")).sendKeys("Test1234");
    await findAndAct(driver, By.id("continue"), (e) => e.click());

    await driver.findElement(By.id("id_user_email")).clear();
    await driver.findElement(By.id("id_user_pw")).clear();

    // Weak password fails.
    await driver.findElement(By.id("id_user_email")).sendKeys("test123");
    await driver.findElement(By.id("id_user_pw")).sendKeys("Test1234");
    await findAndAct(driver, By.id("continue"), (e) => e.click());

    await driver.findElement(By.id("id_user_email")).clear();
    await driver.findElement(By.id("id_user_pw")).clear();

    // Signing up into an ID already used registered with a different provider fails.
    await driver.findElement(By.id("id_user_email")).sendKeys("test123");
    await driver.findElement(By.id("id_user_pw")).sendKeys("Test1234");
    await findAndAct(driver, By.id("continue"), (e) => e.click());
  });

  it("fails to sign into website with invalid email credentials", async function () {
    await driver.wait(
      until.titleIs("Sign Up | Mozilla Rally"),
      WAIT_FOR_PROPERTY
    );

    await findAndAct(
      driver,
      By.xpath('//button[text()="Sign in"]'),
      (e) => e.click()
    );

    // Totally invalid credentials fail
    await driver.findElement(By.id("id_user_email")).sendKeys("test123");
    await driver.findElement(By.id("id_user_pw")).sendKeys("Test1234");
    await findAndAct(driver, By.id("signin-btn"), (e) => e.click());

    await driver.findElement(By.id("id_user_email")).clear();
    await driver.findElement(By.id("id_user_pw")).clear();

    // Logging into an ID already used registered with a different provider fails
    await driver.findElement(By.id("id_user_email")).sendKeys("test123");
    await driver.findElement(By.id("id_user_pw")).sendKeys("Test1234");
    await findAndAct(driver, By.id("signin-btn"), (e) => e.click());
  });

  it("signs up for website with valid email credentials", async function () {

    await findAndAct(driver, By.id("create"), (e) => e.click());

    // Valid credentials succeed.
    await driver
      .findElement(By.id("id_user_email"))
      .sendKeys("test@example.com");
    await driver.findElement(By.id("id_user_pw")).sendKeys("Validpass123");
    await findAndAct(driver, By.id("continue"), (e) => e.click());

    //navigate to sign in cards
    await findAndAct(driver, By.id("back-signin-btn"), (e) => e.click());

    // Unverified account can be logged into, but cannot be used until verified.
    await driver
      .findElement(By.id("id_user_email"))
      .sendKeys("test@example.com");
    await driver.findElement(By.id("id_user_pw")).sendKeys("Validpass123");
    await findAndAct(driver, By.id("signin-btn"), (e) => e.click());

    const readInterface = readline.createInterface({
      input: createReadStream("integration.log"),
      output: process.stdout,
    });

    let verifiedEmail = false;
    readInterface.on("line", async function (line) {
      if (
        !verifiedEmail &&
        line.includes(
          `To verify the email address test@example.com, follow this link:`
        )
      ) {
        const result = line.split(" ");
        const url = result[result.length - 1];
        await driver.executeScript(`window.open("${url}");`);
        verifiedEmail = true;
      }
    });

    // Wait for Selenium to open confirmation link.
    await driver.wait(async () => {
      return (await driver.getAllWindowHandles()).length >= 2;
    }, WAIT_FOR_PROPERTY);

    // Switch back to original window.
    await driver.switchTo().window((await driver.getAllWindowHandles())[0]);

    // Sign in again, need to get a new token that has email_verified as a claim.
    await driver.get("http://localhost:5000/signup");

    await findAndAct(
      driver,
      By.xpath('//button[text()="Sign in"]'),
      (e) => e.click()
    );

    await driver
      .findElement(By.id("id_user_email"))
      .sendKeys("test@example.com");
    await driver.findElement(By.id("id_user_pw")).sendKeys("Validpass123");
    await findAndAct(driver, By.id("signin-btn"), (e) => e.click());

    await driver.wait(
      until.titleIs("Privacy Policy | Mozilla Rally"),
      WAIT_FOR_PROPERTY
    );

    // FIXME logout and log back in
  });
});
