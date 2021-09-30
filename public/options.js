const RUNNING = 0;
const PAUSED = 1;

function changeState(state) {
    if (state === RUNNING) {
        document.getElementById("status").textContent = "RUNNING";
        document.getElementById("toggleEnabled").checked = true;
        document.getElementById("status").classList.remove("bg-red-300");
        document.getElementById("status").classList.add("bg-green-300");
    } else if (state === PAUSED || state === undefined) {
        document.getElementById("status").textContent = "PAUSED";
        document.getElementById("toggleEnabled").checked = false;
        document.getElementById("status").classList.remove("bg-green-300");
        document.getElementById("status").classList.add("bg-red-300");
    } else {
        console.error("Unknown state:", state);
    }
}

// Update UI to current state.
browser.storage.local.get("state").then(storage => changeState(storage.state));

// Listen for state changes.
browser.storage.onChanged.addListener((changes) => changeState(changes.state.newValue));

document.getElementById("toggleEnabled").addEventListener("click", async event => {
    if (event.target.checked === true) {
        browser.runtime.sendMessage({ type: "rally-sdk.change-state", data: { state: "resume" } });
    } else {
        browser.runtime.sendMessage({ type: "rally-sdk.change-state", data: { state: "pause" } });
    }
});

document.getElementById("download").addEventListener("click", async () => {
    // Get all data from local storage.
    const data = await browser.storage.local.get(null);
    console.debug("Converting JSON to CSV:", data);

    // Extract all object keys to use as CSV headers.
    const headerSet = new Set();
    for (const [key, val] of Object.entries(data)) {
        // Ignore bookeeping information.
        if (!["initialized", "state"].includes(key)) {
            for (const [header] of Object.entries(val)) {
                headerSet.add(header);
            }
        }
    }
    const headers = Array.from(headerSet);

    let csvData = "";

    // Print one line with each header.
    for (const [i, header] of headers.entries()) {
        csvData += `${header}`;
        if (i == headers.length - 1) {
            csvData += `\n`;
        } else {
            csvData += `,`;
        }
    }

    // Print the value for eachs measurement, in the same order as the headers on the first line.
    for (const [key, val] of Object.entries(data)) {
        // Ignore bookeeping information.
        if (!["initialized", "state"].includes(key)) {
            for (const [i, header] of headers.entries()) {
                csvData += `${val[header]}`;
                if (i == headers.length - 1) {
                    csvData += `\n`;
                } else {
                    csvData += `,`;
                }
            }
        }
    }

    const dataUrl = (`data:text/csv,${encodeURIComponent(csvData)}`);

    const downloadLink = document.getElementById("downloadLink");
    downloadLink.setAttribute("href", dataUrl);
    downloadLink.setAttribute("download", "rally-study-template.csv");
    downloadLink.click();
});
