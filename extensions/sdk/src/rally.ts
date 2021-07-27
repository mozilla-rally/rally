/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { v4 as uuidv4 } from "uuid";
import { browser } from "webextension-polyfill-ts";

export enum runStates {
  RUNNING,
  PAUSED,
}

export class Rally {
  private _enableDevMode: boolean;
  private _rallyId: string | null;
  private _state: runStates;

  /**
   * Initialize the Rally library.
   *
   * @param {Boolean} enableDevMode
   *        Whether or not to initialize Rally.js in developer mode.
   *        In this mode we ignore problems when communicating with
   *        core add-on.
   *
   * @param {Function} stateChangeCallback
   *        A function to call when the study is paused or running.
   *        Takes a single parameter, `message`, which is the {String}
   *        received regarding the current study state ("paused" or "running".)
   */
  constructor(enableDevMode: boolean, stateChangeCallback: (runState: runStates) => void) {
    console.debug("Rally.initialize");

    if (!stateChangeCallback) {
      throw new Error("Rally.initialize - Initialization failed, stateChangeCallback is required.")
    }

    if (typeof stateChangeCallback !== "function") {
      throw new Error("Rally.initialize - Initialization failed, stateChangeCallback is not a function.")
    }

    this._enableDevMode = Boolean(enableDevMode);

    this._rallyId = null;

    // Set the initial state to paused, and register callback for future changes.
    this._state = runStates.PAUSED;
    this._stateChangeCallback = stateChangeCallback;

    this._promptSignUp().catch(err => console.error(err));
  }

  async _promptSignUp() {
    // await browser.storage.local.set({ "signUpComplete": true });

    const alreadySignedUp = await browser.storage.local.get("signUpComplete");
    console.debug(alreadySignedUp);
    if ("signUpComplete" in alreadySignedUp) {
      console.debug("Already signed-up.");
      return;
    }

    const tabs = await browser.tabs.query({ url: "*://rally-web-spike.web.app/*" });
    // If there are any tabs with the Rally site loaded, focus the latest one.
    if (tabs.length > 0) {
      const tab: any = tabs.pop();
      browser.windows.update(tab.windowId, { focused: true });
      browser.tabs.update(tab.id, { highlighted: true, active: true });
    } else {
      // Otherwise, open the website.
      browser.tabs.create({ url: "https://rally-web-spike.web.app/" });
    }
  }

  /**
   * Pause the current study.
   */
  _pause() {
    if (this._state !== runStates.PAUSED) {
      this._state = runStates.PAUSED;
      this._stateChangeCallback(runStates.PAUSED);
    }
  }

  /**
   * Resume the current study, if paused.
   */
  _resume() {
    if (this._state !== runStates.RUNNING) {
      this._state = runStates.RUNNING;
      this._stateChangeCallback(runStates.RUNNING);
    }
  }

  private _stateChangeCallback(runState: runStates) {
    throw new Error("Method not implemented, must be provided by study.");
  }

  /**
   * Generate and cache the Rally ID.
   *
   * @returns {String} rallyId
   *        The Rally ID (if set).
   */
  async rallyId(): Promise<string | null> {
    if (this._rallyId) {
      return this._rallyId;
    } else {
      const result = await browser.storage.local.get("rallyId");
      if ("rallyId" in result) {
        this._rallyId = result.rallyId;
      } else {
        const uuid = uuidv4();
        await browser.storage.local.set({ "rallyId": uuid });
        this._rallyId = uuid;
      }
    }
    return this._rallyId;
  }

  /**
   * Handler for external messages coming from Rally services.
   */
  async _handleExternalMessage(message: { type: string; }, sender: string) {
    switch (message.type) {
      case "pause":
        this._pause();
        break;
      case "resume":
        this._resume();
        break;
      default:
        throw new Error(`Rally._handleExternalMessage - unexpected message type ${message.type}`);
    }
  }
}