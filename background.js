const ION_SIGNUP_URL = "https://mozilla-ion.github.io/ion-core-addon/";
const CORE_ADDON_ID = "ion-core-addon@mozilla.org";

async function checkIonCore() {
  try {
    const addon = await browser.management.get(CORE_ADDON_ID);
  } catch (ex) {
    console.debug("Core add-on not found, opening sign-up URL", ex);
    await browser.tabs.create({ url: ION_SIGNUP_URL });
  }
}

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

checkIonCore()
  .then((result) => {
    console.debug("Done checking for core add-on");
  })
  .catch((ex) => {
    console.error("Checking for core add-on failed, will re-try on startup");
  });

sendPing()
  .then((result) =>
    console.info(
      "Telemetry submitted, check about:telemetry archived ping data."
    )
  )
  .catch((error) => console.error("Could not send ping:", error));
