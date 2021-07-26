/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

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
   * @param {String} schemaNamespace
   *        The namespace for this study. Must match the server-side schema.
   * @param {Object} key
   *        The JSON Web Key (JWK) used to encrypt the outgoing data.
   *        See the RFC 7517 https://tools.ietf.org/html/rfc7517
   *        for additional information. For example:
   *
   *        {
   *          "kty":"EC",
   *          "crv":"P-256",
   *          "x":"f83OJ3D2xF1Bg8vub9tLe1gHMzV76e8Tus9uPHvRVEU",
   *          "y":"x_FEzRu9m36HLN_tue659LNpXW6pCyStikYjKIWI5a0",
   *          "kid":"Public key used in JWS spec Appendix A.3 example"
   *        }
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
  constructor(enableDevMode: boolean, stateChangeCallback: (arg0: string) => void) {
    console.debug("Rally.initialize");

    if (!stateChangeCallback) {
      throw new Error("Rally.initialize - Initialization failed, stateChangeCallback is required.")
    }

    if (typeof stateChangeCallback !== "function") {
      throw new Error("Rally.initialize - Initialization failed, stateChangeCallback is not a function.")
    }

    this._enableDevMode = Boolean(enableDevMode);
    this._rallyId = null;

    // Set the initial state to running, and register callback for future changes.
    this._state = runStates.RUNNING;
    this._stateChangeCallback = stateChangeCallback;
  }

  /**
   * Pause the current study.
   */
  _pause() {
    if (this._state !== runStates.PAUSED) {
      this._stateChangeCallback("pause");
      this._state = runStates.PAUSED;
    }
  }

  /**
   * Resume the current study, if paused.
   */
  _resume() {
    if (this._state !== runStates.RUNNING) {
      this._stateChangeCallback("resume");
      this._state = runStates.RUNNING;
    }
  }
  private _stateChangeCallback(arg0: string) {
    throw new Error("Method not implemented.");
  }

  /**
   * Public getter to return the Rally ID.
   *
   * @returns {String} rallyId
   *        The Rally ID (if set).
   */
  get rallyId(): string | null {
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