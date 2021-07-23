/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

interface CoreCheckResponse {
  type: string;
  data: {
    enrolled: boolean;
    rallyId: string | null;
  }
}

// NOTE - `kid` is in the IETF but not the WebCrypto spec, @see https://github.com/microsoft/TypeScript/issues/26854
interface RallyJsonWebKey extends JsonWebKey {
  kid: string;
}

export const runStates = {
  RUNNING: "running",
  PAUSED: "paused",
}

export class Rally {
  private _namespace: string;
  private _keyId: string;
  private _key: RallyJsonWebKey;
  private _enableDevMode: boolean;
  private _rallyId: string | null;
  private _state: string;
  private _initialized: boolean;

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
  constructor(schemaNamespace: string, key: RallyJsonWebKey, enableDevMode: boolean, stateChangeCallback: (arg0: string) => void) {
    console.debug("Rally.initialize");

    if (this._validateEncryptionKey(key) !== true) {
      throw new Error("Rally._validateEncryptionKey - Invalid encryption key" + key);
    }

    if (!stateChangeCallback) {
      throw new Error("Rally.initialize - Initialization failed, stateChangeCallback is required.")
    }

    if (typeof stateChangeCallback !== "function") {
      throw new Error("Rally.initialize - Initialization failed, stateChangeCallback is not a function.")
    }

    this._namespace = schemaNamespace;
    this._keyId = key.kid;
    this._key = key;
    this._enableDevMode = Boolean(enableDevMode);
    this._rallyId = null;

    // Set the initial state to running, and register callback for future changes.
    this._state = runStates.RUNNING;
    this._stateChangeCallback = stateChangeCallback;

    // We went through the whole init process, it's now safe
    // to use the Rally public APIs.
    this._initialized = true;
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
   * Validate the provided encryption keys.
   *
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
   *
   *         invalid.
   */
  _validateEncryptionKey(key: any): key is RallyJsonWebKey {
    const requiredProperties = ["kty", "crv", "x", "y", "kid"];

    for (const prop of requiredProperties) {
      if (!(prop in key)) {
        console.error(`Rally._validateEncryptionKey missing property: ${prop}`);
        return false;
      }
    }

    return true;
  }

  /**
   * Submit an encrypted ping through the Rally Core addon.
   *
   * @param {String} payloadType
   *        The type of the encrypted payload. This will define the
   *        `schemaName` of the ping.
   * @param {Object} payload
   *        A JSON-serializable payload to be sent with the ping.
   */
  async sendPing(payloadType: string, payload: object) {
    if (!this._initialized) {
      console.error("Rally.sendPing - Not initialzed");
      return;
    }

    // When in developer mode, dump the payload to the console.
    if (this._enableDevMode) {
      console.log(
        `Rally.sendPing - Developer mode. ${payloadType} will not be submitted with,
        payload:`, payload, `
        key:`, this._key, `
        namespace:`, this._namespace
      );
      return;
    }

    // When paused, not send data.
    if (this._state === runStates.PAUSED) {
      console.debug("Rally.sendPing - Study is currently paused, not sending data");
      return;
    }

    // TODO call glean.js
  }

  /**
   * Public getter to return the Rally ID.
   *
   * @returns {String} rallyId
   *        A JSON-serializable payload to be sent with the ping.
   */
  get rallyId(): string | null {
    return this._rallyId;
  }
}