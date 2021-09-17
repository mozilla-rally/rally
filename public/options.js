const buttons = ["resume", "pause", "end", "download"];

for (const button of buttons) {
    const element = document.getElementById(button);
    element.addEventListener("click", (event) => {
        switch (event.target.id) {
            case "resume":
                browser.runtime.sendMessage({ type: "rally-sdk.change-state", data: { state: "resume" } });

                break;
            case "pause":
                browser.runtime.sendMessage({ type: "rally-sdk.change-state", data: { state: "pause" } });

                break;
            case "end":
                browser.runtime.sendMessage({ type: "rally-sdk.change-state", data: { state: "end" } });

                break;
            case "download":
                browser.storage.local.get(null).then(data => {
                    console.debug("Downloading data:", data);
                    const dataUrl = (`data:application/json,${encodeURIComponent(JSON.stringify(data))}`);

                    const downloadLink = document.getElementById("downloadLink");
                    downloadLink.setAttribute("href", dataUrl);
                    downloadLink.setAttribute("download", "rally-study-template.json");
                    downloadLink.click();
                });
                break;
            default:
                throw new Error(`Unknown button: ${event.target.id}`);
        }
    });
}
