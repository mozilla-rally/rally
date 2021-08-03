/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { exposeMockFirebaseApp } from 'mock-firebase-ts';

const chrome = require("sinon-chrome/extensions");
// We need to provide the `browser.runtime.id` for sinon-chrome to
// be happy and play nice with webextension-polyfill. See this issue:
// https://github.com/mozilla/webextension-polyfill/issues/218
chrome.runtime.id = "testid";
global.chrome = chrome;

jest.mock("webextension-polyfill", () => require("sinon-chrome/webextensions"));

import { strict as assert } from 'assert';
import { Rally, runStates } from '../../src/rally';

describe('Rally_initialize', function () {
  describe('Rally', function () {
    beforeEach(() => {
      chrome.runtime.sendMessage.flush();
      chrome.runtime.sendMessage.yields();
    });
    afterEach(() => {
      delete global.fetch;
      chrome.flush();
    });

    it('must fail with an invalid callback function', function () {
      assert.throws(
        // @ts-ignore
        () => new Rally(true, "not-a-function, will fail")
      );
    });

    it('pauses and resumes when receiving messages', async function () {
      let pausedCallbackCalled = false;
      const rallyPaused = new Rally(
        true, // Developer mode.
        (message) => {
          pausedCallbackCalled = true;
          assert.equal(message, runStates.RUNNING);
        },
      )

      const mocked = exposeMockFirebaseApp(rallyPaused.firebaseApp);

      assert.ok(rallyPaused._state === runStates.PAUSED);

      await rallyPaused._handleExternalMessage({ type: "resume" }, "");
      assert.equal(rallyPaused._state, runStates.RUNNING);

      assert.ok(pausedCallbackCalled);
    });
  });
});
