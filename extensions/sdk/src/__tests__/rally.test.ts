/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { strict as assert } from 'assert';
import { doc } from "firebase/firestore";
import { Rally } from '../rally';
import { RunStates } from "../RunStates";
import { WebMessages } from "../WebMessages";

const FAKE_RALLY_ID = "11f42b4c-8d8e-477e-acd0-b38578228e44";

const flushPromises = () => new Promise(setImmediate);

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
    let result = { exists: () => true };
    if (collection === "users") {
      if (subcollection && subcollection === "studies") {
        result["enrolled"] = false;
      } else {
        result["enrolled"] = false;
        result["uid"] = "test123";
      }
    } else if (collection === "extensionUsers") {
      result["rallyId"] = FAKE_RALLY_ID;
    } else if (collection === "studies") {
      result["studyPaused"] = false;
      result["studyEnded"] = false;
    }

    return result;
  }),
  setDoc: jest.fn(),
  getDoc: jest.fn(doc => {
    return {
      exists: () => true,
      data: () => {
        return doc
      }
    }
  }),
  getFirestore: jest.fn(),
  onSnapshot: jest.fn((doc, callback) => {
    const result = {
      exists: () => true,
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

    const rally = new Rally({
      enableDevMode: false,
      stateChangeCallback: (message) => {
        if (message === RunStates.Paused) {
          pausedCallbackCalled = true;
        } else if (message === RunStates.Running) {
          resumeCallbackCalled = true;
        }
      },
      rallySite: "http://localhost",
      studyId: "exampleStudy1",
      firebaseConfig: {},
      enableEmulatorMode: false,
    })

    assert.equal(rally._state, RunStates.Paused);

    rally._resume();
    assert.equal(rally._state, RunStates.Running);
    assert.ok(resumeCallbackCalled);

    rally._pause();
    assert.ok(rally._state === RunStates.Paused);
    assert.ok(pausedCallbackCalled);
  });

  it('handles sign-up message from web and receives credentials', async function () {
    let pausedCallbackCalled = false;
    let resumeCallbackCalled = false;
    let endedCallbackCalled = false;

    const rally = new Rally({
      enableDevMode: false,
      stateChangeCallback: (message) => {
        if (message === RunStates.Paused) {
          pausedCallbackCalled = true;
        } else if (message === RunStates.Running) {
          resumeCallbackCalled = true;
        } else if (message === RunStates.Ended) {
          endedCallbackCalled = true;
        }

      },
      rallySite: "http://localhost",
      studyId: "exampleStudy1",
      firebaseConfig: {},
      enableEmulatorMode: false
    });

    const rallyToken = "...";
    const message = { type: WebMessages.CompleteSignupResponse, data: { rallyToken } };
    // TODO mock browser.extension.id response
    const sender = { id: null, url: `http://localhost` };

    await rally._handleWebMessage(message, sender);

    // TODO check for complete-signup-response

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
      let result = { exists: () => true };
      if (collection === "users") {
        if (subcollection && subcollection === "studies") {
          result["enrolled"] = true;
        } else {
          result["enrolled"] = true;
          result["uid"] = "test123";
        }
      } else if (collection === "extensionUsers") {
        result["rallyId"] = FAKE_RALLY_ID;
      } else if (collection === "studies") {
        result["studyPaused"] = false;
        result["studyEnded"] = false;
      }

      return result;
    });



    await rally._authStateChangedCallback({ uid: "test123" });

    assert.equal(rally.rallyId, FAKE_RALLY_ID);

    assert.equal(rally._state, RunStates.Running);
    assert.ok(!pausedCallbackCalled);
    assert.ok(resumeCallbackCalled);

    // If the user is authenticated, enrolled in Rally, and not enrolled in the current study, the study should pause.
    pausedCallbackCalled = false;
    resumeCallbackCalled = false;
    endedCallbackCalled = false;

    // @ts-ignore
    doc.mockImplementation((db, collection, uid, subcollection, studyName) => {
      let result = { exists: () => true };
      if (collection === "users") {
        if (subcollection && subcollection === "studies") {
          result["enrolled"] = false;
        } else {
          result["enrolled"] = true;
          result["uid"] = "test123";
        }
      } else if (collection === "extensionUsers") {
        result["rallyId"] = FAKE_RALLY_ID;
      } else if (collection === "studies") {
        result["studyPaused"] = false;
        result["studyEnded"] = false;
      }

      return result;
    });

    await rally._authStateChangedCallback({ uid: "test123" });

    assert.equal(rally._state, RunStates.Paused);
    assert.ok(pausedCallbackCalled);
    assert.ok(!resumeCallbackCalled);

    // If the user is authenticated, enrolled in Rally, and re-enrolled in the current study, the study should resume.
    pausedCallbackCalled = false;
    resumeCallbackCalled = false;
    endedCallbackCalled = false;

    // @ts-ignore
    doc.mockImplementation((db, collection, uid, subcollection, studyName) => {
      let result = { exists: () => true };
      if (collection === "users") {
        if (subcollection && subcollection === "studies") {
          result["enrolled"] = true;
        } else {
          result["enrolled"] = true;
          result["uid"] = "test123";
        }
      } else if (collection === "extensionUsers") {
        result["rallyId"] = FAKE_RALLY_ID;
      } else if (collection === "studies") {
        result["studyPaused"] = false;
        result["studyEnded"] = false;
      }

      return result;
    });

    await rally._authStateChangedCallback({ uid: "test123" });

    assert.equal(rally._state, RunStates.Running);
    assert.ok(!pausedCallbackCalled);
    assert.ok(resumeCallbackCalled);

    assert.equal(rally.rallyId, FAKE_RALLY_ID);

    // FIXME mock calling onSnapshot
    await flushPromises();
  });
});
