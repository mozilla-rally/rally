/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

module.exports = {
    initialize() {
        browser.runtime.onInstalled.addListener(async ({ reason }) => {
            if (reason !== "install") {
                // We're only showing this when the addon is installed.
                return;
            }
            browser.runtime.openOptionsPage().catch(e => {
                console.error(`Study Add-On - Unable to open the control panel`, e);
            });
        });
    },
  };