/* global Dexie */

const RUNNING = "Running";
const PAUSED = "Paused";

const DB_NAME = "attention-stream";

function changeState(state) {
  if (state === RUNNING) {
    document.getElementById("status").textContent = "Running";
    document.getElementById("toggleEnabled").checked = true;
  } else if (state === PAUSED || state === undefined) {
    document.getElementById("status").textContent = "Paused";
    document.getElementById("toggleEnabled").checked = false;
  } else {
    console.error("Unknown state:", state);
  }
}

// Update UI to current state.
browser.storage.local
  .get("state")
  .then((storage) => changeState(storage.state));

// Listen for state changes.
browser.storage.onChanged.addListener((changes) => {
  if (changes.state && changes.state.newValue) {
    changeState(changes.state.newValue);
  }
});

document
  .getElementById("toggleEnabled")
  .addEventListener("click", async (event) => {
    if (event.target.checked === true) {
      browser.runtime.sendMessage({
        type: "rally-sdk.change-state",
        data: { state: "resume" },
      });
    } else {
      browser.runtime.sendMessage({
        type: "rally-sdk.change-state",
        data: { state: "pause" },
      });
    }
  });

document.getElementById("download").addEventListener("click", async () => {
  const db = new Dexie(DB_NAME);
  await db.open();

  for (const tableName of [
    "user-journey",
    "advertisements",
    "article-contents",
    "youtube-video-details",
    "youtube-video-recommendations",
    "youtube-ads",
    "meta-pixel",
  ]) {
    const tableContents = await db.table(tableName).toArray();
    const dataUrl = `data:application/json,${encodeURIComponent(
      JSON.stringify(tableContents, null, 2)
    )}`;

    const downloadLink = document.getElementById("downloadLink");
    downloadLink.setAttribute("href", dataUrl);
    downloadLink.setAttribute(
      "download",
      `rally-attention-stream-${tableName}.json`
    );
    downloadLink.click();
  }
});

document
  .getElementById("clear-database")
  .addEventListener("click", async () => {
    Dexie.delete(DB_NAME);
  });
