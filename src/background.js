/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import "webextension-polyfill";

import { Rally, runStates } from "@mozilla/rally";

import * as webScience from "@mozilla/web-science";

// Example: import a module.
import {
  initialize as exampleInitialize
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
  exampleInitialize();
  // Example: set a listener for WebScience page navigation events.
  webScience.pageNavigation.onPageData.addListener(pageData => {
    console.log("WebScience page navigation event fired.");
  });
}, reject =>{
  // Do not start the study in this case. Something
  // went wrong.
});
