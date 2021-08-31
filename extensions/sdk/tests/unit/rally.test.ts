/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { strict as assert } from 'assert';
import { Rally, runStates, authProviders, webMessages } from '../../src/rally';

import { doc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth'

const FAKE_RALLY_ID = "11f42b4c-8d8e-477e-acd0-b38578228e44";

jest.mock('firebase/app', () => ({
  __esModule: true,
  apps: [],
  initializeApp: jest.fn(),
}))

jest.mock('firebase/auth', () => ({
  __esModule: true,
  apps: [],
  getAuth: jest.fn(() => {
    return {
      currentUser: {
        uid: "testExtension:test123",
        getIdTokenResult: jest.fn(() => {
          return {
            claims: {
              firebaseUid: "test123",
            }
          }
        })
      },
      signOut: jest.fn(),
      onAuthStateChanged: jest.fn(),
    }
  }),
  signInWithCustomToken: jest.fn(),
  onAuthStateChanged: jest.fn(),
  connectAuthEmulator: jest.fn(),
}))

jest.mock('firebase/firestore', () => ({
  __esModule: true,
  apps: [],
  doc: jest.fn((db, collection, uid, subcollection, studyName) => {
    let result = {};
    if (collection === "users") {
      if (subcollection && subcollection === "studies") {
        result = { enrolled: false };
      } else {
        result = { enrolled: false, uid: "test123", enrolledStudies: { "test-study": { enrolled: true } } };
      }
    } else if (collection === "extensionUsers") {
      result = { rallyId: FAKE_RALLY_ID };
    } else if (collection === "studies") {
      result = {
        studyPaused: false,
        studyEnded: false,
      }
    }

    return result;
  }),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
  getFirestore: jest.fn(),
  onSnapshot: jest.fn((doc, callback) => {
    const result = {
      exists: true,
      data: () => {
        return doc
      }
    }
    callback(result);
  }),
  connectFirestoreEmulator: jest.fn()
}))

interface globalThis {
  [key: string]: any; // Add index signature
}
const chrome = require("sinon-chrome/extensions");
// We need to provide the `browser.runtime.id` for sinon-chrome to
// be happy and play nice with webextension-polyfill. See this issue:
// https://github.com/mozilla/webextension-polyfill/issues/218
chrome.runtime.id = "testid";
global.chrome = chrome;

jest.mock("webextension-polyfill", () => require("sinon-chrome/webextensions"));

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
      // @ts-ignore this isn't something that pure Typescript will allow, but there's nothing stopping JS from hitting it at runtime.
      () => new Rally(true, "not-a-function, will fail")
    );
  });

  it('calls callback appropriately when paused and resumed', async function () {
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
      "http://localhost",
      "exampleStudy1"
    )

    assert.equal(rally._state, runStates.PAUSED);

    rally._resume();
    assert.equal(rally._state, runStates.RUNNING);
    assert.ok(resumeCallbackCalled);

    rally._pause();
    assert.ok(rally._state === runStates.PAUSED);
    assert.ok(pausedCallbackCalled);
  });

  it('handles sign-up message from web and receives credentials', async function () {
    let pausedCallbackCalled = false;
    let resumeCallbackCalled = false;
    let endedCallbackCalled = false;

    const rally = new Rally(
      true, // Developer mode.
      (message) => {
        if (message === runStates.PAUSED) {
          pausedCallbackCalled = true;
        } else if (message === runStates.RUNNING) {
          resumeCallbackCalled = true;
        } else if (message === runStates.ENDED) {
          endedCallbackCalled = true;
        }

      },
      "http://localhost",
      "exampleStudy1"
    );

    const rallyToken = "...";
    const message = { type: webMessages.COMPLETE_SIGNUP, data: rallyToken };
    const sender = { url: `http://localhost` };

    const result = await rally._handleWebMessage(message, sender);

    assert.equal(result.type, webMessages.COMPLETE_SIGNUP_RESPONSE);
    assert.equal(result.data.signedUp, true);

    // If the user is authenticated but not enrolled in Rally, onboarding should be triggered.
    await rally._authStateChangedCallback({ uid: "test123" });
    assert.ok(!pausedCallbackCalled);
    assert.ok(!resumeCallbackCalled);
    assert.ok(!endedCallbackCalled);

    // If the user is authenticated, enrolled in Rally, and enrolled in a study, the study should start data collection.
    pausedCallbackCalled = false;
    resumeCallbackCalled = false;
    endedCallbackCalled = false;

    // @ts-ignore
    doc.mockImplementation((db, collection, uid, subcollection, studyName) => {
      let result = {};
      if (collection === "users") {
        if (subcollection && subcollection === "studies") {
          result = { enrolled: true };
        } else {
          result = { enrolled: true, uid: "test123", enrolledStudies: { "test-study": { enrolled: true } } };
        }
      } else if (collection === "extensionUsers") {
        result = { rallyId: FAKE_RALLY_ID };
      }

      return result;
    });

    await rally._authStateChangedCallback({ uid: "test123" });

    assert.equal(await rally.rallyId, FAKE_RALLY_ID);

    assert.equal(rally._state, runStates.RUNNING);
    assert.ok(!pausedCallbackCalled);
    assert.ok(resumeCallbackCalled);

    // If the user is authenticated, enrolled in Rally, and not enrolled in the current study, the study should pause.
    pausedCallbackCalled = false;
    resumeCallbackCalled = false;
    endedCallbackCalled = false;

    // @ts-ignore
    doc.mockImplementation((db, collection, uid, subcollection, studyName) => {
      let result = {};
      if (collection === "users") {
        if (subcollection && subcollection === "studies") {
          result = { enrolled: false };
        } else {
          result = { enrolled: true, uid: "test123", enrolledStudies: { "test-study": { enrolled: true } } };
        }
      } else if (collection === "extensionUsers") {
        result = { rallyId: FAKE_RALLY_ID };
      }

      return result;
    });

    await rally._authStateChangedCallback({ uid: "test123" });

    assert.equal(rally._state, runStates.PAUSED);
    assert.ok(pausedCallbackCalled);
    assert.ok(!resumeCallbackCalled);

    // If the user is authenticated, enrolled in Rally, and re-enrolled in the current study, the study should resume.
    pausedCallbackCalled = false;
    resumeCallbackCalled = false;
    endedCallbackCalled = false;

    // @ts-ignore
    doc.mockImplementation((db, collection, uid, subcollection, studyName) => {
      let result = {};
      if (collection === "users") {
        if (subcollection && subcollection === "studies") {
          result = { enrolled: true };
        } else {
          result = { enrolled: true, uid: "test123", enrolledStudies: { "test-study": { enrolled: true } } };
        }
      } else if (collection === "extensionUsers") {
        result = { rallyId: FAKE_RALLY_ID };
      }

      return result;
    });

    await rally._authStateChangedCallback({ uid: "test123" });

    assert.equal(rally._state, runStates.RUNNING);
    assert.ok(!pausedCallbackCalled);
    assert.ok(resumeCallbackCalled);

    // FIXME mock calling onSnapshot
  });
});
