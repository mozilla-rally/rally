/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

async function sendPing() {
  const currentDate = new Date();

  const payload = {
    datetime: currentDate,
  };

  const options = {
    schemaName: "debug",
    schemaVersion: 1,
  };

  // FIXME pass messages to core add-on
  throw new Error("not implemented");
}

let ion = new Ion();
ion.initialize();

sendPing()
  .then((result) =>
    console.info(
      "Telemetry submitted, check about:telemetry archived ping data."
    )
  )
  .catch((error) => console.error("Could not send ping:", error));
