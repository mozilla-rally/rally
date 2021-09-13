/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { browser } from "webextension-polyfill-ts";
import { webMessages } from "./rally";

/**
 * Send an event to the web page.
 *
 * @param {Object} message
 *        A JSON-serializable object to send back to the
 *        page. It must have the following structure:
 *        {type: "message-type", data: {...}}
 */
function sendToPage(message: { type: any; data: { studyId?: string }; }) {
  console.debug(`Rally: sending message ${message.type} to page with data: ${message.data.studyId}`);

  const event = new CustomEvent("complete-signup", { detail: message.data.studyId });
  window.dispatchEvent(
    // Each study needs its own token. Send to content script.
    event
  );
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
  console.debug(`Rally - "${event.type}" message received from the page`);

  switch (event.type) {
    // Listen for a web-check message, the site will send this when it is initialized.
    case webMessages.WEB_CHECK: {
      console.debug("rally-content - web-check request received");
      browser.runtime.sendMessage({ type: webMessages.WEB_CHECK, data: {} });
      break;
    }
    // Listen for a complete-signup message, which will contain the JWT.
    case webMessages.COMPLETE_SIGNUP_RESPONSE: {
      console.debug("rally-content - Sending complete-signup-response message to background script");
      browser.runtime.sendMessage({ type: webMessages.COMPLETE_SIGNUP_RESPONSE, data: event.detail });
      break;
    }
    default:
      console.error(`Rally - unknown message ${event.type} received`);
  }
}

function handleBackgroundEvents(message: { type: webMessages, data: {} }, sender: any) {
  switch (message.type) {
    // Listen for a complete-signup message, which will contain the JWT.
    case webMessages.COMPLETE_SIGNUP: {
      console.debug("rally-content - complete-signup request:", message);
      sendToPage(message);
      break;
    }
    // Listen for a complete-signup message, which will contain the JWT.
    case webMessages.WEB_CHECK_RESPONSE: {
      console.debug("rally-content - web-check-response request:", message);
      sendToPage(message);
      break;
    }

    default:
      console.error(`Rally - unknown message ${message.type} received`);
  }
}

// Listen for a web-check message from the website.
// @ts-ignore
window.addEventListener(webMessages.WEB_CHECK, e => handlePageEvents(e));

// Listen for a complete-signup-response message from the website.
// @ts-ignore
window.addEventListener(webMessages.COMPLETE_SIGNUP_RESPONSE, e => handlePageEvents(e));

// Listen for messages from the background script.
browser.runtime.onMessage.addListener((message, sender) => {
  handleBackgroundEvents(message, sender);
});

console.debug("Rally SDK - Running content script.");