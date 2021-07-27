'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var uuid = require('uuid');
var webextensionPolyfillTs = require('webextension-polyfill-ts');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
exports.runStates = void 0;
(function (runStates) {
    runStates[runStates["RUNNING"] = 0] = "RUNNING";
    runStates[runStates["PAUSED"] = 1] = "PAUSED";
})(exports.runStates || (exports.runStates = {}));
class Rally {
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
    constructor(enableDevMode, stateChangeCallback) {
        console.debug("Rally.initialize");
        if (!stateChangeCallback) {
            throw new Error("Rally.initialize - Initialization failed, stateChangeCallback is required.");
        }
        if (typeof stateChangeCallback !== "function") {
            throw new Error("Rally.initialize - Initialization failed, stateChangeCallback is not a function.");
        }
        this._enableDevMode = Boolean(enableDevMode);
        this._rallyId = null;
        // Set the initial state to paused, and register callback for future changes.
        this._state = exports.runStates.PAUSED;
        this._stateChangeCallback = stateChangeCallback;
    }
    /**
     * Pause the current study.
     */
    _pause() {
        if (this._state !== exports.runStates.PAUSED) {
            this._state = exports.runStates.PAUSED;
            this._stateChangeCallback(exports.runStates.PAUSED);
        }
    }
    /**
     * Resume the current study, if paused.
     */
    _resume() {
        if (this._state !== exports.runStates.RUNNING) {
            this._state = exports.runStates.RUNNING;
            this._stateChangeCallback(exports.runStates.RUNNING);
        }
    }
    _stateChangeCallback(runState) {
        throw new Error("Method not implemented, must be provided by study.");
    }
    /**
     * Generate and cache the Rally ID.
     *
     * @returns {String} rallyId
     *        The Rally ID (if set).
     */
    rallyId() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._rallyId) {
                return this._rallyId;
            }
            else {
                const result = yield webextensionPolyfillTs.browser.storage.local.get("rallyId");
                if ("rallyId" in result) {
                    this._rallyId = result.rallyId;
                }
                else {
                    const uuid$1 = uuid.v4();
                    yield webextensionPolyfillTs.browser.storage.local.set({ "rallyId": uuid$1 });
                    this._rallyId = uuid$1;
                }
            }
            return this._rallyId;
        });
    }
    /**
     * Handler for external messages coming from Rally services.
     */
    _handleExternalMessage(message, sender) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
}

exports.Rally = Rally;
