/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { strict as assert } from "assert";
import { doc } from "firebase/firestore";
import { Rally } from "../Rally";
import { RunStates } from "../RunStates";
import { WebMessages } from "../WebMessages";
import browser from "webextension-polyfill";

const FAKE_RALLY_ID = "11f42b4c-8d8e-477e-acd0-b38578228e44";

jest.mock("firebase/app", () => ({
  __esModule: true,
  apps: [],
  initializeApp: jest.fn(),
}));

jest.mock("firebase/auth", () => ({
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
            },
          };
        }),
      },
      signOut: jest.fn(),
      onAuthStateChanged: jest.fn(),
    };
  }),
  signInWithCustomToken: jest.fn(),
  onAuthStateChanged: jest.fn(),
  connectAuthEmulator: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  __esModule: true,
  apps: [],
  doc: jest.fn((db, collection, uid, subcollection) => {
    const result = { exists: () => true };
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
  getDoc: jest.fn((doc) => {
    return {
      exists: () => true,
      data: () => {
        return doc;
      },
    };
  }),
  getFirestore: jest.fn(),
  onSnapshot: jest.fn((doc, callback) => {
    const result = {
      exists: () => true,
      data: () => {
        return doc;
      },
    };
    callback(result);
  }),
  connectFirestoreEmulator: jest.fn(),
}));

describe("Rally SDK", function () {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    delete global.fetch;
  });

  async function invokeAuthChangedCallback(rally: Rally, user: any) {
    // eslint-disable-line @typescript-eslint/no-explicit-any
    return await Object.getPrototypeOf(rally).authStateChangedCallback.call(
      rally,
      user
    );
  }

  async function invokeHandleWebMessage(
    rally: Rally,
    message: { type: WebMessages; data },
    sender: any
  ) {
    // eslint-disable-line @typescript-eslint/no-explicit-any
    return await Object.getPrototypeOf(rally).handleWebMessage.call(
      rally,
      message,
      sender
    );
  }

  it("must fail with an invalid callback function", function () {
    assert.throws(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore this isn't something that pure Typescript will allow, but there's nothing stopping JS from hitting it at runtime.
      () => new Rally(true, "not-a-function, will fail")
    );
  });

  it("does not jump to new tab when Rally website is not loaded", async function () {
    // Suppress error printing
    jest.spyOn(console, "error").mockImplementation(() => {});

    const rally = new Rally({
      enableDevMode: false,
      stateChangeCallback: () => {
        /**/
      },
      rallySite: "http://localhost",
      studyId: "exampleStudy1",
      version: "1.0",
      storeId: "example-study-1",
      firebaseConfig: {},
      enableEmulatorMode: false,
      functionsHost: new URL("https://example.com")

    });

    browser.tabs.query = jest.fn().mockReturnValueOnce([]);

    await invokeAuthChangedCallback(rally, null);

    expect(browser.tabs.query).toBeCalledTimes(2);
    expect(browser.tabs.update).toBeCalledTimes(0);
    expect(browser.tabs.reload).toBeCalledTimes(0);

    // A new tab will be opened, since an existing one could not be found.
    expect(browser.tabs.create).toBeCalledTimes(1);

    rally.shutdown();
  });

  it("jumps to new tab when Rally website is loaded", async function () {
    const rally = new Rally({
      enableDevMode: false,
      stateChangeCallback: () => {
        /**/
      },
      rallySite: "http://localhost",
      studyId: "exampleStudy1",
      version: "1.0",
      storeId: "example-study-1",
      firebaseConfig: {},
      enableEmulatorMode: false,
      functionsHost: new URL("https://example.com")

    });

    browser.tabs.query = jest
      .fn()
      .mockReturnValueOnce([{ windowId: 1, tabId: 1 }]);

    await invokeAuthChangedCallback(rally, null);

    expect(browser.tabs.query).toBeCalledTimes(2);
    expect(browser.tabs.update).toBeCalledTimes(1);
    expect(browser.tabs.reload).toBeCalledTimes(1);

    rally.shutdown();
  });

  it("calls callback appropriately when paused and resumed", async function () {
    let pausedCallbackCalled = false;
    let resumeCallbackCalled = false;

    browser.tabs.query = jest.fn().mockReturnValueOnce([]);
    browser.storage.local.get = jest.fn().mockReturnValueOnce({});

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
      version: "1.0",
      storeId: "example-study-1",
      firebaseConfig: {},
      enableEmulatorMode: false,
      functionsHost: new URL("https://example.com")

    });

    assert.equal(rally.state, RunStates.Paused);

    rally.resume();
    assert.equal(rally.state, RunStates.Running);
    assert.ok(resumeCallbackCalled);

    rally.pause();
    assert.ok(rally.state === RunStates.Paused);
    assert.ok(pausedCallbackCalled);

    rally.shutdown();
  });

  it("handles sign-up message from web and receives credentials", async function () {
    let pausedCallbackCalled = false;
    let resumeCallbackCalled = false;
    let endedCallbackCalled = false;

    browser.tabs.query = jest.fn().mockReturnValueOnce([]);
    browser.storage.local.get = jest.fn().mockReturnValueOnce({});

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
      version: "1.0",
      storeId: "example-study-1",
      firebaseConfig: {},
      enableEmulatorMode: false,
      functionsHost: new URL("https://example.com")

    });

    const rallyToken = "...";
    const message = {
      type: WebMessages.CompleteSignupResponse,
      data: { rallyToken },
    };
    const sender = {
      id: "test-id",
      url: `http://localhost`,
      tab: { id: "test-tab-id" },
    };

    browser.runtime.id = "test-id";

    await invokeHandleWebMessage(rally, message, sender);

    // TODO check for complete-signup-response

    // If the user is authenticated but not enrolled in Rally, onboarding should be triggered.
    await invokeAuthChangedCallback(rally, { uid: "test123" });
    assert.ok(!pausedCallbackCalled);
    assert.ok(!resumeCallbackCalled);
    assert.ok(!endedCallbackCalled);

    // If the user is authenticated, enrolled in Rally, and enrolled in a study, the study should start data collection.
    pausedCallbackCalled = false;
    resumeCallbackCalled = false;
    endedCallbackCalled = false;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    doc.mockImplementation((db, collection, uid, subcollection) => {
      const result = { exists: () => true };
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

    await invokeAuthChangedCallback(rally, { uid: "test123" });

    assert.equal(rally.rallyId, FAKE_RALLY_ID);

    assert.equal(rally.state, RunStates.Running);
    assert.ok(!pausedCallbackCalled);
    assert.ok(resumeCallbackCalled);

    // If the user is authenticated, enrolled in Rally, and not enrolled in the current study, the study should pause.
    pausedCallbackCalled = false;
    resumeCallbackCalled = false;
    endedCallbackCalled = false;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    doc.mockImplementation((db, collection, uid, subcollection) => {
      const result = { exists: () => true };
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

    await invokeAuthChangedCallback(rally, { uid: "test123" });

    assert.equal(rally.state, RunStates.Paused);
    assert.ok(pausedCallbackCalled);
    assert.ok(!resumeCallbackCalled);

    // If the user is authenticated, enrolled in Rally, and re-enrolled in the current study, the study should resume.
    pausedCallbackCalled = false;
    resumeCallbackCalled = false;
    endedCallbackCalled = false;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    doc.mockImplementation((db, collection, uid, subcollection) => {
      const result = { exists: () => true };
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

    await invokeAuthChangedCallback(rally, { uid: "test123" });

    assert.equal(rally.state, RunStates.Running);
    assert.ok(!pausedCallbackCalled);
    assert.ok(resumeCallbackCalled);

    assert.equal(rally.rallyId, FAKE_RALLY_ID);

    // FIXME mock calling onSnapshot
    await new Promise(process.nextTick);

    rally.shutdown();
  });

  it("gets attribution code from extension store tab, if present", async function () {
    browser.storage.local.get = jest.fn().mockReturnValueOnce({});
    browser.tabs.query = jest.fn().mockReturnValueOnce([
      {
        url:
          "https://chrome.google.com/webstore/detail/example-study-1?" +
          "utm_source=test_source&utm_medium=test_medium&utm_campaign=test_campaign&utm_term=test_term&utm_content=test_content",
      },
    ]);

    const rally = new Rally({
      enableDevMode: false,
      stateChangeCallback: () => {
        /**/
      },
      rallySite: "http://localhost",
      studyId: "exampleStudy1",
      version: "1.0",
      storeId: "example-study-1",
      firebaseConfig: {},
      enableEmulatorMode: false,
      functionsHost: new URL("https://example.com")
    });

    await new Promise(process.nextTick);

    expect(browser.storage.local.set).toBeCalledWith({
      attribution: {
        campaign: "test_campaign",
        content: "test_content",
        medium: "test_medium",
        source: "test_source",
        term: "test_term",
      },
    });
    expect(browser.storage.local.set).toBeCalledTimes(1);

    rally.shutdown();
  });

  it("does not set attribution code if already set", async function () {
    const attribution = {
      campaign: "test_campaign",
      content: "test_content",
      medium: "test_medium",
      source: "test_source",
      term: "test_term",
    };

    // Suppress error printing
    jest.spyOn(console, "error").mockImplementation(() => {});

    browser.tabs.query = jest.fn().mockReturnValueOnce([]);
    browser.storage.local.get = jest.fn().mockReturnValueOnce({ attribution });

    const rally = new Rally({
      enableDevMode: false,
      stateChangeCallback: () => {
        /**/
      },
      rallySite: "http://localhost",
      studyId: "exampleStudy1",
      version: "1.0",
      storeId: "example-study-1",
      firebaseConfig: {},
      enableEmulatorMode: false,
      functionsHost: new URL("https://example.com")

    });

    await new Promise(process.nextTick);
    expect(browser.storage.local.set).toBeCalledTimes(0);
    expect(browser.tabs.query).toBeCalledTimes(0);

    rally.shutdown();
  });

  it("handles web-check message web and sends attribution codes", async function () {
    const attribution = {
      campaign: "test_campaign",
      content: "test_content",
      medium: "test_medium",
      source: "test_source",
      term: "test_term",
    };

    browser.storage.local.get = jest.fn().mockReturnValueOnce({ attribution });

    const rally = new Rally({
      enableDevMode: false,
      stateChangeCallback: () => {
        /**/
      },
      rallySite: "http://localhost",
      studyId: "exampleStudy1",
      version: "1.0",
      storeId: "example-study-1",
      firebaseConfig: {},
      enableEmulatorMode: false,
      functionsHost: new URL("https://example.com")

    });

    expect(browser.tabs.query).toBeCalledTimes(0);

    const message = { type: WebMessages.WebCheck, data: {} };
    const sender = {
      id: "test-id",
      url: `http://localhost`,
      tab: { id: "test-tab-id" },
    };
    browser.runtime.id = "test-id";

    browser.storage.local.get = jest.fn().mockReturnValueOnce({ attribution });

    await invokeHandleWebMessage(rally, message, sender);

    expect(browser.tabs.sendMessage).toBeCalledTimes(2);
    expect(browser.tabs.sendMessage).nthCalledWith(1, "test-tab-id", {
      data: {
        studyId: "exampleStudy1",
        version: "1.0",
      },
      type: WebMessages.CompleteSignup,
    });

    expect(browser.tabs.sendMessage).nthCalledWith(2, "test-tab-id", {
      data: {
        studyId: "exampleStudy1",
        version: "1.0",
        attribution,
      },
      type: WebMessages.WebCheckResponse,
    });

    rally.shutdown();
  });
});
