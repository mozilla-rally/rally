# Rally Attention Stream
This is the Rally "Attention Stream" extension, originally based on the [Rally Study Template](https://github.com/mozilla-rally/study-template/).

## Getting Started

Prerequisites: current versions of [Firefox](https://www.mozilla.org/firefox/new/) and [Node.js](https://nodejs.org/). You might find it helpful to install Node.js with a [package manager](https://nodejs.org/en/download/package-manager/), such as [Scoop](https://scoop.sh/) on Windows, [Homebrew](https://brew.sh/) on macOS, or [`apt-get`](https://help.ubuntu.com/community/AptGet/Howto) on Ubuntu Linux.

Install dependencies:
```
cd extensions/attention-stream
npm install
```

### Playtest aka dev mode

To run the extension in "playtest" aka "dev mode", which only collects data locally and provides a UI that allows
downloading any data the extension has collected locally:

```
npm run dev
```

This will use the `web-ext` tool to run the extension under Chrome (TODO add Firefox config instructions).

Alternatively, you can just generate the build output using this command:

```
npm run build:developer
```

Then use `chrome://extensions` in Developer Mode (for Chrome) or `about:debugging` (in Firefox) to load `extensions/attention-stream/`.

### Production mode

Production mode submits data to the Mozilla data pipeline, using the [Rally Web Platform](https://github.com/mozilla-rally/rally-web-platform) to control whether data collection is enabled (it is disabled by default).

```
npm run build
```

### Packaging for distribution

To produce a .zip file suitable for uploading to the Chrome Web Store / Firefox Add-ons store, run:

```
npm run package
```

You may also produce a distributable playtest version with:

```
npm run package:developer
```

## Build System Commands
This template comes with a set of predefined Node.js commands, which function similar to makefile targets. These commands should help you with study implementation, debugging, testing, and deployment. You run each command with `npm run <command>`.

* `build` - Builds the study extension, by bundling JavaScript implementation in `src/` and copying non-JavaScript files. Output is in the `dist/` directory.
* `dev` - Bundles the study extension (like `build`), but in _developer mode_, launch Firefox with the study extension installed, automatically rebuild the study if a file changes, and automatically reload the study in Firefox if the study is rebuilt. In developer mode, Rally SDK does not contact the website or the Firebase backend. Developer mode also provides a [source map](https://developer.mozilla.org/en-US/docs/Tools/Debugger/How_to/Use_a_source_map) for bundled JavaScript, so you can use the [Debugger](https://developer.mozilla.org/en-US/docs/Tools/Debugger) as if the JavaScript were not bundled. You should typically use developer mode when implementing and testing your study.
* `dev:emulator` - Like `dev`, but run in _emulator mode_, which connects to a local Firebase emulator. See the [Rally Web Platform docs](https://github.com/mozilla-rally/rally-web-platform#quickstart) for information on running a local Firebase emulator.
* `lint`: Run linting on the study extension.
* `package`: Build the study extension (`build`), then package the built study into an archive for distribution. Output is in the `web-ext-artifacts/` directory.
* `test:integration`: Packages the study extension (`package`), then runs the provided integration test.

## Debugging in Chrome
* Debugging the Background Script - Navigate to `chrome://extensions`, and enable Developer Mode. Then, click on the link to the background page.
* Debugging a Content Script - Unlike Firefox, Chrome does not show content scripts in the standard devtools. However, you may use the [debugger keyword](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger) in the source code, which will cause the standard Chrome devtools to pause the page when that breakpoint is hit.

## Debugging in Firefox
* Debugging the Background Script - Navigate to the browser debugging page (`about:debugging`), click This Firefox, then click Inspect on the study extension. The page that opens is [Firefox Developer Tools](https://developer.mozilla.org/en-US/docs/Tools) for the background page, including a [Web Console](https://developer.mozilla.org/en-US/docs/Tools/Web_Console), [JavaScript Debugger](https://developer.mozilla.org/en-US/docs/Tools/Debugger), and [Network Monitor](https://developer.mozilla.org/en-US/docs/Tools/Network_Monitor). Background script console output will also appear on the [Browser Console](https://developer.mozilla.org/en-US/docs/Tools/Browser_Console). The template's web-ext configuration will automatically open both Firefox Developer Tools for the background page and the Browser Console on browser startup.
* Debugging a Content Script - On a page where the content script is running, open [Firefox Developer Tools](https://developer.mozilla.org/en-US/docs/Tools). The [Web Console](https://developer.mozilla.org/en-US/docs/Tools/Web_Console) will include output from the content script, and you can select the content script in the [JavaScript Debugger](https://developer.mozilla.org/en-US/docs/Tools/Debugger). Content script console output will also appear on the [Browser Console](https://developer.mozilla.org/en-US/docs/Tools/Browser_Console).
