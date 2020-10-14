/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

const CORE_ADDON_ID = "ion-core-addon@mozilla.org";
const ION_SIGNUP_URL = "https://mozilla-ion.github.io/ion-core-addon/";

class Ion {
  /**
   * Initialize the Ion library.
   */
  async initialize() {
    console.debug("Ion.initialize");

    await this._checkIonCore().then(
        () => console.debug("Ion.initialize - Found Ion Core")
      ).catch(
        async () => await browser.tabs.create({ url: ION_SIGNUP_URL })
      );

    // Listen for incoming messages from the Core addon.
    browser.runtime.onMessageExternal.addListener(
      (m, s) => this._handleExternalMessage(m, s));
  }

  /**
   * Check if the Core addon is installed.
   *
   * @returns {Promise} resolved if the core addon was found and
   *          communication was successful, rejected otherwise.
   */
  async _checkIonCore() {
    try {
      return await browser.management.get(CORE_ADDON_ID);
    } catch (ex) {
      console.error("Ion._checkIonCore - core addon not found", ex);
      return Promise.reject(ex);
    }

    // TODO: in addition to checking if the addon is installed,
    // this should check if user has joined the platform by sending
    // a message to the addon and waiting for its response.
  }

  /**
   * Handles messages coming in from external addons.
   *
   * @param {Object} message
   *        The payload of the message.
   * @param {runtime.MessageSender} sender
   *        An object containing informations about who sent
   *        the message.
   * @returns {Promise} The response to the received message.
   *          It can be resolved with a value that is sent to the
   *          `sender`.
   */
  _handleExternalMessage(message, sender) {
    // We only expect messages coming from the core addon.
    if (sender.id != CORE_ADDON_ID) {
      return Promise.reject(
        new Error(`Ion._handleExternalMessage - unexpected sender ${sender.id}`));
    }

    switch (message.type) {
      case "uninstall": {
        return browser.management.uninstallSelf({showConfirmDialog: false});
      } break;
      default:
        return Promise.reject(
          new Error(`Ion._handleExternalMessage - unexpected message type ${message.type}`));
    }
  }
};
