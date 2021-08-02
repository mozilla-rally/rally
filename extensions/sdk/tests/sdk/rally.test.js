/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const chrome = require("sinon-chrome/extensions");
// We need to provide the `browser.runtime.id` for sinon-chrome to
// be happy and play nice with webextension-polyfill. See this issue:
// https://github.com/mozilla/webextension-polyfill/issues/218
chrome.runtime.id = "testid";
global.chrome = chrome;

jest.mock("webextension-polyfill", () => require("sinon-chrome/webextensions"));
jest.mock('firebase/app', () => {
  return {
    auth: jest.fn(),
    firestore: jest.fn(),
  };
});

import { strict as assert } from 'assert';
import { Rally, runStates } from '../../dist/rally.js';

describe('Rally_initialize', function () {
  describe('initialize()', function () {
    it('must fail with an invalid callback function', function () {
      assert.throws(
        this.rally = () => new Rally(true, "not-a-function, will fail")
      );
    });
  });
  describe('Rally', function () {
    beforeEach(function () {
      const devMode = true;
      const stateChangeCallback = () => { };
      this.rally = new Rally(devMode, stateChangeCallback);
    });

    it('must export the list of valid run states', function () {
      assert.ok(runStates instanceof Object);
    });

    it(`initially starts in paused mode`, function () {
      assert.ok(this.rally._state === runStates.PAUSED);
    });

    describe('_pause()', function () {
      it('pauses when receiving message', async function () {
        chrome.runtime.sendMessage.flush();
        chrome.runtime.sendMessage.yields();

        let callbackCalled = false;
        this.rally = new Rally(
          true, // Developer mode.
          (message) => {
            callbackCalled = true;
            assert.equal(message, runStates.PAUSED);
          },
        )

        this.rally._state = runStates.RUNNING;
        await this.rally._handleExternalMessage({ type: "pause" });

        assert.equal(this.rally._state, runStates.PAUSED);
        assert.ok(callbackCalled);
      });
    });

    describe('_resume()', function () {
      it('resumes when receiving message', async function () {
        chrome.runtime.sendMessage.flush();
        chrome.runtime.sendMessage.yields();

        let callbackCalled = false;
        this.rally = new Rally(
          true, // Developer mode.
          (message) => {
            callbackCalled = true;
            assert.equal(message, runStates.RUNNING);
          },
        )

        this.rally._state = runStates.PAUSED;
        await this.rally._handleExternalMessage({ type: "resume" });

        assert.equal(this.rally._state, runStates.RUNNING);
        assert.ok(callbackCalled);
      });
    });
    afterEach(function () {
      delete global.fetch;
      chrome.flush();
    });
  });
});
