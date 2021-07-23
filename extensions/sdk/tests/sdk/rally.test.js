/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { strict as assert } from 'assert';
import { stat } from 'fs';

import { Rally, runStates } from '../../dist/rally.js';

describe('Rally_initialize', function () {
  describe('initialize()', function () {
    it('must fail with an invalid callback function', function () {
      assert.rejects(
        this.rally = new Rally("schema-namespace", {}, true, "not-a-function, will fail")
      );
    });

    it('must fail with a missing key ID', function () {
      assert.rejects(
        this.rally = new Rally("schema-namespace", {}, true, "no-key-id, will fail")
      );
    });

    it('must fail with an invalid key ID', function () {
      assert.rejects(
        this.rally = new Rally("schema-namespace", { kid: false }, true, "bad-key-id, will fail")
      );
    });
  });
  describe('Rally', function () {
    beforeEach(function () {
      const devMode = true;
      const stateChangeCallback = () => { };
      this.rally = new Rally(devMode, stateChangeCallbacks);
    });
    it('no core addon skips the info page in dev mode', async function () {
      // Mock the check to make it fail.
      this.rally._checkRallyCore = async () => {
        throw "Core Add-On not available.";
      };

      await this.rally.initialize(
        "schema-namespace",
        { kid: "key-id" },
        true, // Developer mode.
        () => { },
      );

      assert.ok(browser.tabs.create.notCalled);
    });

    it('no core addon rejects init and opens signup', async function () {
      chrome.tabs.create.yields();

      // Mock the check to make it fail.
      this.rally._checkRallyCore = async () => {
        throw "Core Add-On not available.";
      };

      await assert.rejects(
        this.rally.initialize(
          "schema-namespace",
          { kid: "key-id" },
          false,
          () => { },
        )
      );

      assert.ok(chrome.tabs.create.calledOnce);
    });

    it('must export the list of valid run states', function () {
      assert.ok(runStates instanceof Object);
      // Expect this to be an enum where the value is a lower-case string matching the key.
      for (const [key, val] of Object.entries(runStates)) {
        assert.equal(key, val.toUpperCase());
      }
    });

  });

  describe('_checkRallyCore()', function () {
    it('must reject if no core addon is installed', async function () {
      // The `runtime.sendMessage` API rejects if the target addon
      // is not installed. Simulate the same behaviour here, see
      // the docs:
      // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/sendMessage
      chrome.runtime.sendMessage.yields(
        Promise.reject(new Error("No addon makes this API reject")));

      assert.rejects(
        this.rally._checkRallyCore(),
        { message: "Rally._checkRallyCore - core addon check failed with: Error: No addon makes this API reject" }
      );
    });

    it('must fail if the core addon is installed, but user is not enrolled in Rally', async function () {
      chrome.runtime.sendMessage.yields(
        { type: "core-check-response", data: { rallyId: null, enrolled: false } });

      assert.rejects(
        this.rally._checkRallyCore(),
        { message: "Rally._checkRallyCore - core addon check failed with: Error: Rally._checkRallyCore - core addon present, but not enrolled in Rally" }
      );
    });

    it('must succeed if the core addon is installed', async function () {
      chrome.runtime.sendMessage.yields(
        { type: "core-check-response", data: { rallyId: "fakeRallyId", enrolled: true } });

      await this.rally._checkRallyCore();
    });
  });

  describe('_pause()', function () {
    it('pauses when receiving message', async function () {
      chrome.runtime.sendMessage.flush();
      chrome.runtime.sendMessage.yields();

      let callbackCalled = false;
      await this.rally.initialize(
        "schema-namespace",
        { kid: "key-id" },
        true, // Developer mode.
        (message) => {
          callbackCalled = true;
          assert.equal(message, "pause");
        },
      )

      this.rally._state = "running";
      this.rally._handleExternalMessage({ type: "pause" }, { id: "rally-core@mozilla.org" });

      assert.equal(this.rally._state, "paused");
      assert.ok(callbackCalled);
    });
  });

  describe('_resume()', function () {
    it('resumes when receiving message', async function () {
      chrome.runtime.sendMessage.flush();
      chrome.runtime.sendMessage.yields();

      let callbackCalled = false;
      await this.rally.initialize(
        "schema-namespace",
        { kid: "key-id" },
        true, // Developer mode.
        (message) => {
          callbackCalled = true;
          assert.equal(message, "resume");
        },
      )

      this.rally._state = "paused";
      this.rally._handleExternalMessage({ type: "resume" }, { id: "rally-core@mozilla.org" });

      assert.equal(this.rally._state, "running");
      assert.ok(callbackCalled);
    });
  });
  afterEach(function () {
    delete global.fetch;
    chrome.flush();
  });
});
