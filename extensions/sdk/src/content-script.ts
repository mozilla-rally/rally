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
function sendToPage(message: { type: any; data: {}; }) {
  console.debug(`Rally: sending response ${message.type} to page`);
  const data = message.data || {};
  window.dispatchEvent(new CustomEvent(message.type, { detail: data }));
}

function sendAddonAliveEvent() {
  sendToPage({ type: webMessages.WEB_CHECK_RESPONSE, data: {} })
}

/**
 * Bridge page events to the background script.
 *
 * ** IMPORTANT **
 *
 * All the messages passing through here must NOT BE TRUSTED, as
 * any actor could inject custom scripts and impersonate the web page.
 */
function handlePageEvents(event: Event) {
  console.debug(`Rally - "${event.type}" message received from the page`);

  switch (event.type) {
    case webMessages.COMPLETE_SIGNUP: {
      browser.runtime.sendMessage(webMessages.COMPLETE_SIGNUP, event);
      break;
    }
    case webMessages.WEB_CHECK: {
      browser.runtime.sendMessage(webMessages.WEB_CHECK, {});
      break;
    }
    default:
      console.error(`Rally - unknown message ${event.type} received`);
  }
}

window.addEventListener("complete-signup", e => handlePageEvents(e));

console.debug("Rally - Running content script");
// Send an event as soon as injected, to notify the web page if
// it is already open.
sendAddonAliveEvent();
