/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// This is the main background script for the study template.
// The build system will bundle dependencies into this script
// and output the bundled scripr to dist/background.js.

// Import the WebExtensions polyfill, for cross-browser compatibility.
// Note that Rally and WebScience currently only support Firefox.
// import { browser } from "webextension-polyfill";

import { Rally, runStates } from "@mozilla/rally";

import PingEncryptionPlugin from "@mozilla/glean/plugins/encryption";
import Glean, { Uploader, UploadResult, UploadResultStatus } from "@mozilla/glean/webext";

import { Dexie } from "dexie";

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
let rallySite = "https://members.rally.mozilla.org";

// The current Firebase configuration.
let firebaseConfig = {
  "apiKey": "AIzaSyAv_gSjNRMbEq3BFCNHPn0soXMCx2IxLeM",
  "authDomain": "moz-fx-data-rally-w-prod-dfa4.firebaseapp.com",
  "projectId": "moz-fx-data-rally-w-prod-dfa4",
  "storageBucket": "moz-fx-data-rally-w-prod-dfa4.appspot.com",
  "messagingSenderId": "982322764946",
  "appId": "1:982322764946:web:f9b6aea488cebde47ada4b",
  "functionsHost": "https://us-central1-moz-fx-data-rally-w-prod-dfa4.cloudfunctions.net"
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
      // this.contentScript = await browser.contentScripts.register({
      //  js: [{ file: "dist/exampleContentScript.content.js" }],
      //  matches: ["http://localhost/*"]
      // });
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
      // this.contentScript.unregister();
      if (this.worker) {
        this.worker.terminate();
      }

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

// TODO move to dynamic import, and only load in dev mode.
import pako from "pako";

class GetPingsUploader extends Uploader {
  async post(url: string, body: Uint8Array): Promise<UploadResult> {
    const ping = JSON.parse(new TextDecoder().decode(pako.inflate(body)));

    console.debug("Dev mode, storing glean ping instead of sending:", ping, url);

    const tableName = url.split("/")[5];
    const documentId = url.split("/")[7];
    console.debug("tableName:", tableName);

    const db = new Dexie("pixelhunt");

    const columns = [];
    const entries = {};
    for (const metric of Object.keys(ping.metrics)) {
      for (const [columnName, value] of Object.entries(ping.metrics[metric])) {
        const validColumnName = columnName.replace(".", "_");
        columns.push(validColumnName);
        entries[validColumnName] = value;
      }
    }

    console.debug("setting stores:", { [tableName]: columns.join() });
    // FIXME get this from glean yaml
    db.version(1).stores({
      "fbpixelhunt-journey": "id,rally_id,user_journey_page_visit_start_date_time,user_journey_page_visit_stop_date_time,user_journey_attention_duration,user_journey_page_id,user_journey_url",
      "fbpixelhunt-pixel": "id,rally_id,facebook_pixel_has_facebook_login_cookies,facebook_pixel_pixel_page_id,facebook_pixel_url",
      "study-enrollment": "id,rally_id"
    });

    await db.open();

    console.debug("using", tableName, "to store:", entries);
    await db.table(tableName).put({ id: documentId, ...entries });

    // Tell Glean upload went fine. Glean will then clear the ping from temporary storage.
    return {
      status: 200,
      // @ts-ignore
      result: UploadResultStatus.Success
    };
  }
}

if (enableDevMode) {
  console.debug("init glean");
  Glean.initialize("rally-markup-fb-pixel-hunt", true, {
    debug: { logPings: true },
    httpClient: new GetPingsUploader(),
  } as unknown as Configuration);

} else {
  Glean.initialize("rally-markup-fb-pixel-hunt", true, {
    debug: { logPings: false },
    plugins: [
      new PingEncryptionPlugin(publicKey)
    ]
  } as unknown as Configuration);
}

// Take no further action until the rallyStateChange callback is called.
