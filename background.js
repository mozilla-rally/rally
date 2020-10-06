/* eslint-disable no-undef */
async function sendPing() {
  const currentDate = new Date();

  const payload = {
    datetime: currentDate,
  };

  const options = {
    schemaName: "debug",
    schemaVersion: 1,
  };

  await browser.telemetry.submitEncryptedPing(payload, options);
}

sendPing()
  .then((result) =>
    console.info(
      "Telemetry submitted, check about:telemetry archived ping data."
    )
  )
  .catch((error) => console.error("Could not send ping:", error));
