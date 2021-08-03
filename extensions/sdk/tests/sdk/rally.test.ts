/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jest.mock('firebase/app', () => ({
  __esModule: true,
  default: {
    apps: [],
    initializeApp: jest.fn(),
    auth: jest.fn(() => {
      return {
        signInWithEmailAndPassword: jest.fn(),
        onAuthStateChanged: jest.fn(),
        currentUser: {
          email: "test1@example.com"
        }
      }
    }),
    firestore: jest.fn(),
  },
}));

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const chrome = require("sinon-chrome/extensions");
// We need to provide the `browser.runtime.id` for sinon-chrome to
// be happy and play nice with webextension-polyfill. See this issue:
// https://github.com/mozilla/webextension-polyfill/issues/218
chrome.runtime.id = "testid";
global.chrome = chrome;

jest.mock("webextension-polyfill", () => require("sinon-chrome/webextensions"));

import { strict as assert } from 'assert';
import { Rally, runStates } from '../../src/rally';

describe('Rally SDK', function () {
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
    let resumeCallbackCalled = false;

    const rally = new Rally(
      true, // Developer mode.
      (message) => {
        if (message === runStates.PAUSED) {
          pausedCallbackCalled = true;
        } else if (message === runStates.RUNNING) {
          resumeCallbackCalled = true;
        }
      },
    )

    assert.equal(rally._state, runStates.PAUSED);

    await rally._resume();
    assert.equal(rally._state, runStates.RUNNING);
    assert.ok(resumeCallbackCalled);

    await rally._pause();
    assert.ok(rally._state === runStates.PAUSED);
    assert.ok(pausedCallbackCalled);
  });

  it('handles sign-up message from web and receives credentials', async function () {
    const rally = new Rally(
      true, // Developer mode.
      () => { }
    );

    const email = "test1@example.com";
    const password = "password1";

    const credential = { email, password };
    const message = { type: "complete-signup", data: credential };
    const sender = { url: `https://__RALLY_HOST__` };

    const result = await rally._handleWebMessage(message, sender);

    assert.equal(result.type, "complete-signup-result");
    assert.equal(result.data.signedUp, true);

    // @ts-ignore
    expect(firebase.auth.mock.calls.length).toBe(4);

    // @ts-ignore
    expect(firebase.firestore.mock.calls.length).toBe(2);
  });
});
