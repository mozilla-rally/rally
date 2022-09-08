/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// This is the main background script for the Rally Attention Stream.
// The build system will bundle dependencies into this script
// and output the bundled scripr to dist/background.js.

// Import the WebExtensions polyfill, for cross-browser compatibility.
// Note that Rally and WebScience currently only support Firefox.
// import { browser } from "webextension-polyfill";

import { Rally, RunStates } from "@mozilla/rally-sdk";

import PingEncryptionPlugin from "@mozilla/glean/plugins/encryption";
import Glean, {
  Uploader,
  UploadResult,
  UploadResultStatus,
} from "@mozilla/glean/webext";

import { destinationDomains as newsDomains } from "./news-domains";

// Import generated Glean metrics.
import * as userJourney from "../src/generated/userJourney";
import * as rallyManagementMetrics from "../src/generated/rally";
import * as advertisements from "../src/generated/advertisements";
import * as articleContents from "../src/generated/articleContents";
import * as youtubeVideoDetails from "../src/generated/youtubeVideoDetails";
import * as youtubeVideoRecommendations from "../src/generated/youtubeVideoRecommendations";
import * as youtubeAd from "../src/generated/youtubeAd";
import * as metaPixel from "../src/generated/metaPixel";

// Import generated Glean pings.
import * as attentionStreamPings from "../src/generated/pings";

import browser from "webextension-polyfill";

import { Dexie } from "dexie";

import * as webScience from "@mozilla/web-science";

declare global {
  const __ENABLE_DEVELOPER_MODE__: boolean;
  const __ENABLE_EMULATOR_MODE__: boolean;
}

// Developer mode runs locally and does not use the Firebase server.
// Data is collected locally, and an options page is provided to export it.
// eslint-disable-next-line no-undef
const enableDevMode = Boolean(__ENABLE_DEVELOPER_MODE__);
// Emulator mode connects to the Firebase emulators. Note that the Firebase
// config below must match.
// eslint-disable-next-line no-undef
const enableEmulatorMode = Boolean(__ENABLE_EMULATOR_MODE__);

// The Rally-assigned Study ID.
let studyId = "attentionStream";

// The "slug" on the extension store.
let storeId = "rally-attention-stream";

// The website hosting the Rally UI.
let rallySite = "https://members.rally.mozilla.org";

const publicKey = {
  crv: "P-256",
  kid: "rally-attention-stream",
  kty: "EC",
  x: "NFFGDrJUoq-qUEW2JTjk5HJJvOMqZ4XnZGkwJEapDcM",
  y: "odcj1VLRkgkyhLapDVwzC9ai0ltVWYQ7u4kETcGoMoE",
};

// The current Firebase configuration.
let firebaseConfig = {
  apiKey: "AIzaSyAv_gSjNRMbEq3BFCNHPn0soXMCx2IxLeM",
  authDomain: "moz-fx-data-rally-w-prod-dfa4.firebaseapp.com",
  projectId: "moz-fx-data-rally-w-prod-dfa4",
  storageBucket: "moz-fx-data-rally-w-prod-dfa4.appspot.com",
  messagingSenderId: "982322764946",
  appId: "1:982322764946:web:f9b6aea488cebde47ada4b",
  functionsHost:
    "https://us-central1-moz-fx-data-rally-w-prod-dfa4.cloudfunctions.net",
};

// Overrides for dev mode - use local emulators with "attentionStream" as study ID.
if (enableEmulatorMode) {
  studyId = "attentionStream";
  rallySite = "http://localhost:3000";
  firebaseConfig = {
    apiKey: "abc123",
    authDomain: "demo-rally.firebaseapp.com",
    projectId: "demo-rally",
    storageBucket: "demo-rally.appspot.com",
    messagingSenderId: "abc123",
    appId: "1:123:web:abc123",
    functionsHost: "http://localhost:5001",
  };
}

const fbUrls = ["*://www.facebook.com/*"];
const fbHostname = ["www.facebook.com"];
if (enableDevMode) {
  fbUrls.push("*://localhost/*");
  fbHostname.push("localhost");
}

// This function will be called when the study state changes. By default,
// a study starts "paused". If a user opts-in to a particular study, then the
// state will change to "started".
//
// The study state may change at any time (for example, the server may choose to pause a particular study).
// Studies should stop data collection and try to unload as much as possible when in "paused" state.
async function stateChangeCallback(newState) {
  switch (newState) {
    case RunStates.Running:
      // The all-0 Rally ID indicates developer mode, in case data is accidentally sent.
      let rallyId = enableDevMode
        ? "00000000-0000-0000-0000-000000000000"
        : rally.rallyId;

      // The all-1 Rally ID means that there was an error with the Rally ID.
      if (!rallyId) {
        rallyId = "11111111-1111-1111-1111-111111111111";
      }
      console.info(`Study running with Rally ID: ${rallyId}`);

      const storage = await browser.storage.local.get("enrolled");
      if (storage.enrolled !== true) {
        console.info("Recording enrollment.");
        rallyManagementMetrics.id.set(rallyId);
        attentionStreamPings.studyEnrollment.submit();

        browser.storage.local.set({
          enrolled: true,
        });
      }

      // The Rally API has been initialized.
      // Initialize the study and start it.
      await browser.storage.local.set({ state: RunStates.Running });

      // User Journey
      {
        this.pageDataListener = async (pageData) => {
          console.debug(
            `WebScience page navigation event fired with page data:`,
            pageData
          );

          // This will be a unique ID matching this page for this browsing session.
          userJourney.pageId.set(pageData.pageId);

          // WebScience returns a Number for these, but Glean is expecting an integer.
          userJourney.attentionDuration.set(
            Math.floor(pageData.attentionDuration)
          );
          userJourney.audioDuration.set(Math.floor(pageData.audioDuration));
          userJourney.attentionAndAudioDuration.set(
            Math.floor(pageData.attentionAndAudioDuration)
          );

          // Max relative scroll depth is a percentage expressed as a decimal by WebScience,
          // but Glean is expecting an integer.
          userJourney.maxRelativeScrollDepth.set(
            Math.floor(pageData.maxRelativeScrollDepth * 100)
          );

          const pageVisitStart = new Date(pageData.pageVisitStartTime);
          const pageVisitStop = new Date(pageData.pageVisitStopTime);
          userJourney.pageVisitStartDateTime.set(pageVisitStart);
          userJourney.pageVisitStopDateTime.set(pageVisitStop);

          // Referrer is optional, and will be an empty string if unset.
          if (pageData.referrer) {
            userJourney.referrer.setUrl(pageData.referrer);
          }
          userJourney.url.setUrl(pageData.url);

          // Submit the metrics constructed above.
          attentionStreamPings.userJourney.submit();
        };

        webScience.pageNavigation.onPageData.addListener(
          this.pageDataListener,
          { matchPatterns: ["<all_urls>"] }
        );
      }

      // Firefox only supports persistent contentScripts as of version 105
      // ... remove this check when that version of Firefox ships.
      let persistAcrossSessions = true;
      const browserInfo =
        browser.runtime &&
        browser.runtime.getBrowserInfo &&
        (await browser.runtime.getBrowserInfo());
      if (browserInfo && browserInfo.name === "Firefox") {
        persistAcrossSessions = false;
      }

      // News Articles and Ads
      {
        const matchPatterns = webScience.matching.domainsToMatchPatterns(
          newsDomains,
          true
        );

        // Handle article content callbacks.
        this.pageTextListener = async (pageData) => {
          articleContents.pageId.set(pageData.pageId);
          articleContents.url.setUrl(pageData.url);
          articleContents.title.set(pageData.title);
          articleContents.textContent.set(pageData.textContent);

          attentionStreamPings.articleContents.submit();
        };

        webScience.pageText.onTextParsed.addListener(this.pageTextListener, {
          matchPatterns,
        });

        // Register the content script for measuring advertisement info.
        // The CSS selectors file is needed to find ads on the page.
        const contentScriptId = "page-ads";
        let scripts = await browser.scripting.getRegisteredContentScripts({
          ids: [contentScriptId],
        });

        if (scripts.length === 0) {
          await browser.scripting.registerContentScripts([
            {
              id: contentScriptId,
              js: ["dist/browser-polyfill.min.js", "dist/page-ads.content.js"],
              matches: matchPatterns,
              persistAcrossSessions,
              runAt: "document_idle",
            },
          ]);
        }

        this.advertisementListener = async (adInfo, sender) => {
          advertisements.pageId.set(adInfo.pageId);
          advertisements.url.setUrl(
            webScience.matching.normalizeUrl(sender.url)
          );
          advertisements.body.set(JSON.stringify(adInfo.body));
          advertisements.ads.set(JSON.stringify(adInfo.ads));

          attentionStreamPings.advertisements.submit();
        };

        // Handle advertisement callbacks.
        webScience.messaging.onMessage.addListener(this.advertisementListener, {
          type: "WebScience.advertisements",
          schema: {
            pageId: "string",
            type: "string",
            url: "string",
            ads: "object",
            body: "object",
          },
        });
      }

      // YouTube Video Info, Ads, and Recommendations
      {
        // Register the content scripts for "monkeypatching" YouTube requests
        // and parsing that request data for ads and video recommendations
        const contentScriptId = "youtube";
        let scripts = await browser.scripting.getRegisteredContentScripts({
          ids: [contentScriptId],
        });

        if (scripts.length === 0) {
          await browser.scripting.registerContentScripts([
            {
              id: "youtube",
              js: [
                "dist/browser-polyfill.min.js",
                "dist/youtube/injector.content.js",
                "dist/youtube/yt-main.content.js",
              ],
              matches: ["*://*.youtube.com/*"],
              persistAcrossSessions: false,
              runAt: "document_start",
            },
          ]);
        }

        this.youtubeListener = async (message) => {
          if (!message || !message.type) return;
          const messageType = message.type;
          delete message.type;

          const constructAndSendPing = async (metrics, ping, data) => {
            for (let [key, value] of Object.entries(data)) {
              if (typeof value === "undefined") continue; // skip empty data
              if (
                typeof value === "object" &&
                // Make exceptions for arrays with short (<50 chars) strings
                key !== "firstTwentyVideoIds" &&
                key !== "keywords"
              ) {
                // Stringify value if it's an object
                // or an array that doesn't fit into Glean's string_list type
                value = JSON.stringify(value);
              }
              metrics[key].set(value);
            }
            ping.submit();
          };

          switch (messageType) {
            case "MozillaRally.YouTube.videodetails":
              console.debug("YouTube: CURRENT VIDEO DETAILS:", message);
              constructAndSendPing(
                youtubeVideoDetails,
                attentionStreamPings.youtubeVideoDetails,
                message
              );
              break;

            case "MozillaRally.YouTube.recommendations":
              console.debug("YouTube: VIDEO RECOMMENDATIONS:", message);
              constructAndSendPing(
                youtubeVideoRecommendations,
                attentionStreamPings.youtubeVideoRecommendations,
                message
              );
              break;

            case "MozillaRally.YouTube.ads":
              console.debug("YouTube: ADVERTISEMENTS:", message);
              message.ads.forEach((ad) => {
                ad.pageId = message.pageId;
                ad.url = message.url;
                constructAndSendPing(
                  youtubeAd,
                  attentionStreamPings.youtubeAds,
                  ad
                );
              });
              break;

            default:
              console.debug(
                `Mozilla Rally - unknown message type received: ${message.type}`
              );
          }
        };

        browser.runtime.onMessage.addListener(this.youtubeListener);
      }

      // Meta Pixel
      {
        this.metaPixelListener = (details) => {
          console.debug(`Meta Pixel listener fired with data:`, details);
          handlePixel(details).catch((err: Error) =>
            console.error("Meta Pixel Listener Error:", err)
          );

          async function handlePixel(
            details: browser.WebRequest.OnBeforeRequestDetailsType
          ) {
            const url = new URL(details.url);
            const tabId = details.tabId;

            // Meta pixels live at `*://www.facebook.com/tr/`
            if (
              fbHostname.includes(url.hostname) &&
              url.pathname.match(/^\/tr/)
            ) {
              if (enableDevMode) {
                browser.action.getBadgeText({}).then((current) => {
                  if (current) {
                    let count = parseInt(current);
                    count++;
                    browser.action.setBadgeText({ text: count.toString() });
                  } else {
                    browser.action.setBadgeText({ text: "1" });
                  }
                });
              }

              // Pixels may be either HTTP GET requests for an image, or a POST from JS.
              // If a POST is detected, collect the form data submitted as well.
              let formData;
              if (details.method === "POST") {
                if (
                  "requestBody" in details &&
                  "formData" in details.requestBody
                ) {
                  const rawFormData = details.requestBody.formData;
                  formData = new URLSearchParams(rawFormData).toString();
                }
              }

              // Grab the WebScience page_id from the content script
              const [{ result: pageId = undefined } = {}] =
                await browser.scripting.executeScript({
                  target: {
                    tabId,
                  },
                  func: () => {
                    return window?.webScience?.pageManager?.pageId;
                  },
                });

              metaPixel.pixelUrl.set(details.url);
              details.initiator && metaPixel.url.set(details.initiator);
              pageId && metaPixel.pageId.set(pageId);
              formData && metaPixel.formData.set(formData);

              attentionStreamPings.metaPixel.submit();
            }
          }
        };
        // Listen for requests to Facebook, and then report on the requests to the FB pixel.
        browser.webRequest.onBeforeRequest.addListener(
          this.metaPixelListener,
          { urls: fbUrls },
          ["requestBody"]
        );
      }

      break;
    case RunStates.Paused:
      console.log(`Study paused with Rally ID: ${rally.rallyId}`);

      // Take down all resources from run state.
      webScience.pageNavigation.onPageData.removeListener(
        this.pageDataListener
      );
      webScience.pageText.onTextParsed.removeListener(this.pageTextListener);
      webScience.messaging.onMessage.removeListener(this.advertisementListener);
      browser.runtime.onMessage.removeListener(this.youtubeListener);
      browser.webRequest.onBeforeRequest.removeListener(this.metaPixelListener);

      await browser.scripting.unregisterContentScripts({
        ids: ["page-ads", "youtube"],
      });
      await browser.storage.local.set({ state: RunStates.Paused });

      break;
    case RunStates.Ended:
      console.log(`Study ended with Rally ID: ${rally.rallyId}`);

      // Take down all resources from run state.
      webScience.pageNavigation.onPageData.removeListener(
        this.pageDataListener
      );
      webScience.pageText.onTextParsed.removeListener(this.pageTextListener);
      webScience.messaging.onMessage.removeListener(this.advertisementListener);
      browser.runtime.onMessage.removeListener(this.youtubeListener);
      browser.webRequest.onBeforeRequest.removeListener(this.metaPixelListener);

      await browser.scripting.unregisterContentScripts({
        ids: ["page-ads", "youtube"],
      });
      await browser.storage.local.set({ ended: true });

      break;
    default:
      throw new Error(`Unknown study state: ${newState}`);
  }
}

// Initialize the Rally SDK.
const rally = new Rally({
  enableDevMode,
  stateChangeCallback,
  rallySite,
  studyId,
  storeId,
  firebaseConfig,
  enableEmulatorMode,
});

// TODO move to dynamic import, and only load in dev mode.
import pako from "pako";
import type { Configuration } from "@mozilla/glean/dist/types/core/config";

class GetPingsUploader extends Uploader {
  async post(url: string, body: Uint8Array): Promise<UploadResult> {
    const ping = JSON.parse(new TextDecoder().decode(pako.inflate(body)));

    console.debug(
      "Dev mode, storing glean ping instead of sending:",
      ping,
      url
    );

    const tableName = url.split("/")[5];
    const documentId = url.split("/")[7];
    console.debug("tableName:", tableName);

    const db = new Dexie("attention-stream");

    const columns = [];
    const entries = {};
    for (const metric of Object.keys(ping.metrics)) {
      for (const [columnName, value] of Object.entries(ping.metrics[metric])) {
        const validColumnName = columnName.replace(".", "_");
        columns.push(validColumnName);
        entries[validColumnName] = value;
      }
    }

    // create an index for the `user_journey_page_visit_stop_date_time` column, so it can be sorted in the UI (@see `public/options.js`)
    db.version(2).stores({
      advertisements: "id",
      "article-contents": "id",
      "user-journey": "id, rally_id, user_journey_page_visit_stop_date_time",
      "study-enrollment": "id, rally_id",
      "youtube-video-details": "id",
      "youtube-video-recommendations": "id",
      "youtube-ads": "id",
      "meta-pixel": "id",
    });

    await db.open();

    console.debug("using", tableName, "to store:", entries);
    await db.table(tableName).put({ id: documentId, ...entries });

    // Tell Glean upload went fine. Glean will then clear the ping from temporary storage.
    return {
      status: 200,
      // @ts-ignore
      result: UploadResultStatus.Success,
    };
  }
}

if (enableDevMode) {
  // When in developer mode, open the options page with the playtest controls when the toolbar button is clicked.
  const manifest = browser.runtime.getManifest();
  if (manifest.manifest_version === 2) {
    browser.browserAction.onClicked.addListener(
      async () => await browser.runtime.openOptionsPage()
    );
  } else {
    browser.action.onClicked.addListener(
      async () => await browser.runtime.openOptionsPage()
    );
  }

  // Also open it automatically on the first run after a new install only.
  browser.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === "install") {
      await browser.runtime.openOptionsPage();
    } else {
      console.debug("unsupported install reason:", details.reason);
    }
  });

  Glean.initialize("rally-attention-stream", true, {
    debug: { logPings: true },
    httpClient: new GetPingsUploader(),
  } as unknown as Configuration);

  browser.runtime.onMessage.addListener((message, sender) => {
    console.debug(
      "dev mode received message:",
      message,
      "from sender:",
      sender
    );
  });
} else {
  Glean.initialize("rally-attention-stream", true, {
    debug: { logPings: false },
    plugins: [new PingEncryptionPlugin(publicKey)],
  } as unknown as Configuration);
}

// Take no further action until the stateChangeCallback callback is called.
