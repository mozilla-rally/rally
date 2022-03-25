/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { browser } from "webextension-polyfill-ts";
import { WebMessages } from "./WebMessages";

/**
 * Send an event to the web page.
 *
 * @param {Object} message
 *        A JSON-serializable object to send back to the
 *        page. It must have the following structure:
 *        {type: "message-type", data: {...}}
 */
function sendToPage(message: { type: any; data: { studyId?: string; }; }) { // eslint-disable-line @typescript-eslint/no-explicit-any
  console.debug(`Rally.sendToPage (content) - sending message ${message.type} to page with data: ${message.data.studyId}`);

  switch (message.type) {
    case WebMessages.CompleteSignup: {
      window.dispatchEvent(new CustomEvent(WebMessages.CompleteSignup, { detail: message.data.studyId }));
      break;
    }
    case WebMessages.WebCheckResponse: {
      window.dispatchEvent(new CustomEvent(WebMessages.WebCheckResponse, {}));
      break;
    }
    default: {
      console.warn(`Rally.sendToPage (content) - unknown message type: ${message.type}`);
    }
  }
}

/**
 * Bridge page events to the background script.
 *
 * ** IMPORTANT **
 *
 * All the messages passing through here must NOT BE TRUSTED, as
 * any actor could inject custom scripts and impersonate the web page.
 */
async function handlePageEvents(event: CustomEvent) {
  console.debug(`Rally.handlePageEvents (content) - "${event.type}" message received from the page`);

  switch (event.type) {
    // Listen for a web-check message, the site will send this when it is initialized.
    case WebMessages.WebCheck: {
      console.debug("Rally.handlePageEvents (content) - web-check request received, sending to background script");
      browser.runtime.sendMessage({ type: WebMessages.WebCheck, data: {} });
      break;
    }
    // Listen for a complete-signup message, which will contain the JWT.
    case WebMessages.CompleteSignupResponse: {
      console.debug("Rally.handlePageEvents (content) - complete-signup-response received, sending to background script");
      browser.runtime.sendMessage({ type: WebMessages.CompleteSignupResponse, data: event.detail });
      break;
    }
    default:
      console.warn(`Rally.handlePageEvents (content) - unknown message ${event.type} received`);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
function handleBackgroundEvents(message: { type: WebMessages, data: Record<string, unknown>; }, sender: any) {
  switch (message.type) {
    // Listen for a complete-signup message, which will contain the JWT.
    case WebMessages.CompleteSignup: {
      console.debug("Rally.handleBackgroundEvents (content) - complete-signup request:", message);
      sendToPage(message);
      break;
    }
    // Listen for a complete-signup message, which will contain the JWT.
    case WebMessages.WebCheckResponse: {
      console.debug("Rally.handleBackgroundEvents (content) - web-check-response request:", message);
      sendToPage(message);
      break;
    }

    default:
      console.error(`Rally.handleBackgroundEvents (content) - unknown message ${message.type} received`);
  }
}

let isStarted = false;

export function startContentScript() {
  if (isStarted) {
    return;
  }

  isStarted = true;

  // Listen for a web-check message from the website.
  window.addEventListener(WebMessages.WebCheck, (e: CustomEvent) => handlePageEvents(e));

  // Listen for a complete-signup-response message from the website.
  window.addEventListener(WebMessages.CompleteSignupResponse, (e: CustomEvent) => handlePageEvents(e));

  // Listen for messages from the background script.
  browser.runtime.onMessage.addListener((message, sender) => {
    handleBackgroundEvents(message, sender);
  });

  console.debug("Rally SDK - Running content script.");
}