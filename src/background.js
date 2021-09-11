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

// Initialize the Rally API.s
const rally = new Rally(
  // The following constant is automatically provided by
  // the build system.
  __ENABLE_DEVELOPER_MODE__,
  // A sample callback with the study state.
  async function (newState) {
    switch (newState) {
      case (runStates.RUNNING):
        console.log(`Study running with Rally ID: ${rally.rallyId}`);
        // The Rally API has been initialized.
        // Initialize the study and start it.

        // Example: initialize the example module.
        exampleModuleInitialize();

        // Example: set a listener for WebScience page navigation events on
        // *://*.mozilla.org/* pages. Note that the manifest origin
        // permissions currently only include *://*.mozilla.org/*. You should
        // update the manifest permissions as needed for your study.

        this.pageDataListener = (pageData) => {
          console.log(`WebScience page navigation event fired with page data: ${pageData}`);
        };

        webScience.pageNavigation.onPageData.addListener(this.pageDataListener, { matchPatterns: ["*://*.mozilla.org/*"] });

        // Example: register a content script for *://*.mozilla.org/* pages
        // Note that the content script has the same relative path in dist/
        // that it has in src/. The content script can include module
        // dependencies (either your own modules or modules from npm), and
        // they will be automatically bundled into the content script by
        // the build system.
        this.contentScript = await browser.contentScripts.register({
          js: [{ file: "dist/exampleContentScript.content.js" }],
          matches: ["*://*.mozilla.org/*"]
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

        break;
      case (runStates.ENDED):
        console.log(`Study ended with Rally ID: ${rally.rallyId}`);

        break;
      default:
        throw new Error(`Unknown study state: ${newState}`);
    }
  },
  // The website hosting the Rally Web UI.
  "http://localhost:3000",
  // The Rally Study ID.
  "exampleStudy1",
  // The Firebase config.
  {
    "apiKey": "abc123",
    "authDomain": "demo-rally.firebaseapp.com",
    "projectId": "demo-rally",
    "storageBucket": "demo-rally.appspot.com",
    "messagingSenderId": "abc123",
    "appId": "1:123:web:abc123",
    "functionsHost": "http://localhost:5001"
  }
);
