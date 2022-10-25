/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { strict as assert } from "assert";
import browser from "webextension-polyfill";

import { testResetGlean } from "@mozilla/glean/testing";

// Import generated Glean metrics.
import { utmCodes } from "../generated/attribution";

// Import generated Glean pings.
import { attribution } from "../generated/pings";

// @ts-ignore
import { RunStates } from "@mozilla/rally-sdk";
import { jest } from "@jest/globals";
import { ErrorType } from "@mozilla/glean/error";

const FAKE_RALLY_ID = "11f42b3c-8d8e-477e-abd0-b38578228e44";

describe("Attention Stream", function () {
  const testAppId = `node.test.attentionStream`;

  beforeEach(async () => {
    jest.clearAllMocks();
    await testResetGlean(testAppId);
  });

  afterEach(async () => {
    // Wait for Glean pings to finish.
    await new Promise(process.nextTick);
  });

  it("opens newtab page on idle", async function () {
    // Suppress error printing
    jest.spyOn(console, "error").mockImplementation(() => {});

    //@ts-ignore
    browser.tabs.query = jest.fn().mockReturnValueOnce([]);

    // @ts-ignore
    const manifest = {
      name: "Rally Attention Stream Unit Test",
      manifest_version: 2,
      version: "1.0.0",
    };

    browser.runtime.getManifest = jest.fn(() => manifest);
    const { stateChangeCallback } = await import("../background");

    const pingWasSent = attribution.testBeforeNextSubmit(async () => {
      // Check there is some value in the app started metric
      assert.ok((await utmCodes.campaign.testGetValue()) === undefined);
      // Check no errors were recorded on that metric either.
      assert.equal(
      await utmCodes.campaign.testGetNumRecordedErrors(ErrorType.InvalidValue),
        0
      );
    });

    this.pageDataListener = jest.fn();
    await stateChangeCallback(RunStates.Running);

    // Check that the ping validator does not throw.
    assert.doesNotThrow(async () => await pingWasSent);

    expect(browser.tabs.query).toBeCalledTimes(2);
    expect(browser.tabs.update).toBeCalledTimes(0);
    expect(browser.tabs.reload).toBeCalledTimes(0);

    // A new tab will be opened, since an existing one could not be found.
    expect(browser.tabs.create).toBeCalledTimes(0);

    await stateChangeCallback(RunStates.Paused);
  });
});
