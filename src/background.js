/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// This is the main background script for the study template.
// The build system will bundle dependencies into this script
// and output the bundled scripr to dist/background.js.

// Import the WebExtensions polyfill, for cross-browser compatibility.
// Note that Rally and WebScience currently only support Firefox.
import "webextension-polyfill";

// Import the Rally API.
import { Rally, runStates } from "@mozilla/rally";

// Import the WebScience API.
import * as webScience from "@mozilla/web-science";

// Example: import a module.
import {
  initialize as exampleModuleInitialize
} from './exampleModule';

// Initialize the Rally API.
const rally = new Rally();
rally.initialize(
  // A sample key id used for encrypting data.
  "sample-invalid-key-id",
  // A sample *valid* JWK object for the encryption.
  {
    "kty":"EC",
    "crv":"P-256",
    "x":"f83OJ3D2xF1Bg8vub9tLe1gHMzV76e8Tus9uPHvRVEU",
    "y":"x_FEzRu9m36HLN_tue659LNpXW6pCyStikYjKIWI5a0",
    "kid":"Public key used in JWS spec Appendix A.3 example"
  },
  // The following constant is automatically provided by
  // the build system.
  __ENABLE_DEVELOPER_MODE__,
  // A sample callback with the study state.
  (newState) => {
    if (newState === runStates.RUNNING) {
      console.log("The study can run.");
    } else {
      console.log("The study must stop.");
    }
  }
).then(resolve => {
  // The Rally API has been initialized.
  // Initialize the study and start it.

  // Example: initialize the example module.
  exampleModuleInitialize();

  // Example: set a listener for WebScience page navigation events on
  // *://*.mozilla.org/* pages. Note that the manifest origin
  // permissions currently only include *://*.mozilla.org/*. You should
  // update the manifest permissions as needed for your study.
  webScience.pageNavigation.onPageData.addListener(pageData => {
    console.log("WebScience page navigation event fired.");
  }, {
    matchPatterns: [ "*://*.mozilla.org/*" ]
  });

  // Example: register a content script for *://*.mozilla.org/* pages
  // Note that the content script has the same relative path in dist/
  // that it has in src/. The content script can include module
  // dependencies (either your own modules or modules from npm), and
  // they will be automatically bundled into the content script by
  // the build system.
  browser.contentScripts.register({
    js: [ { file: "dist/exampleContentScript.content.js" } ],
    matches: [ "*://*.mozilla.org/*" ]
  });

  // Example: launch a Web Worker, which can handle tasks on another
  // thread. Note that the worker script has the same relative path in
  // dist/ that it has in src/. The worker script can include module
  // dependencies (either your own modules or modules from npm), and
  // they will be automatically bundled into the worker script by the
  // build system.
  new Worker(browser.runtime.getURL("dist/exampleWorkerScript.worker.js"));
}, reject => {
  // Do not start the study in this case. Something
  // went wrong.
});
