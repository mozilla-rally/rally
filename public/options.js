const buttons = ["resume", "pause", "end", "download"];

for (const button of buttons) {
    console.debug();
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
                console.debug("TODO");
                break;
            default:
                throw new Error(`Unknown button: ${event.target.id}`);
        }
    });
}
