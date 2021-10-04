/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// This is the main background script for the study template.
// The build system will bundle dependencies into this script
// and output the bundled scripr to dist/background.js.

// Import the WebExtensions polyfill, for cross-browser compatibility.
// Note that Rally and WebScience currently only support Firefox.
// import { browser } from "webextension-polyfill";

// Import the Rally API.
import { Rally, runStates } from "@mozilla/rally";

// Import the WebScience API.
import * as webScience from "@mozilla/web-science";

// Example: import a module.
import {
  initialize as exampleModuleInitialize,
  uninitialize as exampleModuleUninitialize
} from './exampleModule';

// Developer mode runs locally and does not use the Firebase server.
// Data is collected locally, and an options page is provided to export it.
// eslint-disable-next-line no-undef
const enableDevMode = Boolean(__ENABLE_DEVELOPER_MODE__);
// Emulator mode connects to the Firebase emulators. Note that the Firebase
// config below must match.
// eslint-disable-next-line no-undef
const enableEmulatorMode = Boolean(__ENABLE_EMULATOR_MODE__);

// The Rally-assigned Study ID.
let studyId = "rally-study-template";

// The website hosting the Rally UI.
let rallySite = "https://rally-web-spike.web.app/";

// The current Firebase configuration.
let firebaseConfig = {
  "apiKey": "AIzaSyAJv0aTJMCbG_e6FJZzc6hSzri9qDCmvoo",
  "authDomain": "rally-web-spike.firebaseapp.com",
  "projectId": "rally-web-spike",
  "storageBucket": "rally-web-spike.appspot.com",
  "messagingSenderId": "85993993890",
  "appId": "1:85993993890:web:b975ff99733d2d8b50c9fb",
  "functionsHost": "https://us-central1-rally-web-spike.cloudfunctions.net"
};

// Overrides for dev mode - use local emulators with "exampleStudy1" as study ID.
if (enableEmulatorMode) {
  studyId = "exampleStudy1";
  rallySite = "http://localhost:3000";
  firebaseConfig = {
    "apiKey": "abc123",
    "authDomain": "demo-rally.firebaseapp.com",
    "projectId": "demo-rally",
    "storageBucket": "demo-rally.appspot.com",
    "messagingSenderId": "abc123",
    "appId": "1:123:web:abc123",
    "functionsHost": "http://localhost:5001"
  }
}

// This function will be called when the study state changes. By default,
// a study starts "paused". If a user opts-in to a particular study, then the
// state will change to "started".
//
// The study state may change at any time (for example, the server may choose to pause a particular study).
// Studies should stop data collection and try to unload as much as possible when in "paused" state.
async function stateChangeCallback(newState) {
  switch (newState) {
    case (runStates.RUNNING):
      console.log(`Study running with Rally ID: ${rally.rallyId}`);
      // The Rally API has been initialized.
      // Initialize the study and start it.

      // Example: initialize the example module.
      exampleModuleInitialize();
      await browser.storage.local.set({ "state": runStates.RUNNING });


      // Example: set a listener for WebScience page navigation events on
      // http://localhost/* pages. Note that the manifest origin
      // permissions currently only include http://localhost/*. You should
      // update the manifest permissions as needed for your study.

      this.pageDataListener = async (pageData) => {
        console.log(`WebScience page navigation event fired with page data:`, pageData);
        if (enableDevMode) {
          const data = {};
          data[pageData.pageId] = pageData;
          await browser.storage.local.set(data);
        }
      };

      webScience.pageNavigation.onPageData.addListener(this.pageDataListener, { matchPatterns: ["http://localhost/*"] });

      // Example: register a content script for http://localhost/* pages
      // Note that the content script has the same relative path in dist/
      // that it has in src/. The content script can include module
      // dependencies (either your own modules or modules from npm), and
      // they will be automatically bundled into the content script by
      // the build system.
      this.contentScript = await browser.contentScripts.register({
        js: [{ file: "dist/exampleContentScript.content.js" }],
        matches: ["http://localhost/*"]
      });
      // Example: launch a Web Worker, which can handle tasks on another
      // thread. Note that the worker script has the same relative path in
      // dist/ that it has in src/. The worker script can include module
      // dependencies (either your own modules or modules from npm), and
      // they will be automatically bundled into the worker script by the
      // build system.

      this.worker = new Worker("/dist/exampleWorkerScript.worker.js");

      break;
    case (runStates.PAUSED):
      console.log(`Study paused with Rally ID: ${rally.rallyId}`);

      // Take down all resources from run state.
      exampleModuleUninitialize();
      webScience.pageNavigation.onPageData.removeListener(this.pageDataListener);
      this.contentScript.unregister();
      this.worker.terminate();

      await browser.storage.local.set({ "state": runStates.PAUSED });

      break;
    case (runStates.ENDED):
      console.log(`Study ended with Rally ID: ${rally.rallyId}`);

      await browser.storage.local.set({ "ended": true });

      break;
    default:
      throw new Error(`Unknown study state: ${newState}`);
  }
}

// Initialize the Rally SDK.
const rally = new Rally({ enableDevMode, stateChangeCallback, rallySite, studyId, firebaseConfig, enableEmulatorMode });

// When in developer mode, open the options page with the playtest controls.
if (enableDevMode) {
  browser.storage.local.set({ "initialized": true }).then(browser.runtime.openOptionsPage());
}

chrome.browserAction.onClicked.addListener(async () =>
  await browser.runtime.openOptionsPage()
);

// Take no further action until the rallyStateChange callback is called.