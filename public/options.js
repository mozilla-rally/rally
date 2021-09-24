const RUNNING = 0;
const PAUSED = 1;

browser.storage.onChanged.addListener((changes, area) => {
    console.debug("received storage change:", changes, area);
    if (changes.state) {
        console.debug("changes state:", changes.state);
        if (changes.state.newValue === RUNNING) {
            console.debug("change state to running");
            document.getElementById("status").textContent = "RUNNING";
            document.getElementById("status").classList = ["bg-green-300"]
        } else if (changes.state.newValue === PAUSED) {
            console.debug("change state to paused");
            document.getElementById("status").textContent = "PAUSED";
            document.getElementById("status").classList = ["bg-red-300"];
        } else {
            console.error("Unknown change state:", changes.state);
        }
    }
});

document.getElementById("toggleEnabled").addEventListener("click", async event => {
    if (event.target.checked === true) {
        browser.runtime.sendMessage({ type: "rally-sdk.change-state", data: { state: "resume" } });
    } else {
        browser.runtime.sendMessage({ type: "rally-sdk.change-state", data: { state: "pause" } });
    }
});

document.getElementById("download").addEventListener("click", async event => {
    const data = await browser.storage.local.get(null);
    console.debug("Downloading data:", data);

    const dataUrl = (`data:application/json,${encodeURIComponent(JSON.stringify(data))}`);

    const downloadLink = document.getElementById("downloadLink");
    downloadLink.setAttribute("href", dataUrl);
    downloadLink.setAttribute("download", "rally-study-template.json");
    downloadLink.click();
});

browser.storage.local.get("state").then(storage => {
    if (storage.state === PAUSED) {
        document.getElementById("status").textContent = "PAUSED";
        document.getElementById("toggleEnabled").checked = false;
        document.getElementById("status").classList = ["bg-red-300"];
    } else if (storage.state === RUNNING) {
        document.getElementById("status").textContent = "RUNNING";
        document.getElementById("toggleEnabled").checked = true;
        document.getElementById("status").classList = ["bg-green-300"]
    } else {
        console.error("Unknown state:", storage.state);
    }
});