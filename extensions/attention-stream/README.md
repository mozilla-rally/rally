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

## Quickstart

Run in dev mode with Chrome:

```
npm run dev
```

Run in dev mode, with Firefox:

```
TARGET=firefox-desktop npm run dev
```

## Getting Started

Prerequisites: current versions of [Firefox](https://www.mozilla.org/firefox/new/) and [Node.js](https://nodejs.org/). You might find it helpful to install Node.js with a [package manager](https://nodejs.org/en/download/package-manager/), such as [Scoop](https://scoop.sh/) on Windows, [Homebrew](https://brew.sh/) on macOS, or [`apt-get`](https://help.ubuntu.com/community/AptGet/Howto) on Ubuntu Linux.
1. Either [fork this repository](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo) or [create a new repository from this template](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/creating-a-repository-on-github/creating-a-repository-from-a-template).
2. Update the [WebExtensions manifest](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json) ([`manifest.json`](./manifest.json)) for your study. You should update the [`description`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/description), [`author`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/author), [`name`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/name), [`version`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/version), and [`homepage_url`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/homepage_url) fields. The Rally team will provide a value for the [`browser_specific_settings.gecko.id`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_specific_settings) field.
3. Update the [Node.js package configuration](https://docs.npmjs.com/cli/v7/configuring-npm/package-json) ([`package.json`](./package.json)) for your study. You should update the `name`, `version`, `description`, `repository`, `keywords`, `author`, `license`, `bugs`, and `homepage` fields.
4. In the forked repository, run [`npm install`](https://docs.npmjs.com/cli/v7/commands/npm-install) to install Node.js package dependencies. A new `node_modules/` directory will be automatically populated with these dependencies.
5. Run `npm run dev`. The build system will build your study extension, launch Firefox with the study extension installed, and automatically open both the [Browser Console](https://developer.mozilla.org/en-US/docs/Tools/Browser_Console) and [Firefox Developer Tools](https://developer.mozilla.org/en-US/docs/Tools) for the background page.
6. Commit your study extension to a repository! You now have a clean and functional starting point for implementing your study. If this template is updated in future, you can also easily merge those updates into your study.

## Build System Commands
This template comes with a set of predefined Node.js commands, which function similar to makefile targets. These commands should help you with study implementation, debugging, testing, and deployment. You run each command with `npm run <command>`.

* `build` - Builds the study extension, by bundling JavaScript implementation in `src/` and copying non-JavaScript files. Output is in the `dist/` directory.
* `dev` - Bundles the study extension (like `build`), but in _developer mode_, launch Chrome with the study extension installed, automatically rebuild the study if a file changes, and automatically reload the study in Chrome if the study is rebuilt. In developer mode, Rally SDK does not contact the website or the Firebase backend. Developer mode also provides a [source map](https://developer.mozilla.org/en-US/docs/Tools/Debugger/How_to/Use_a_source_map) for bundled JavaScript, so you can use the [Debugger](https://developer.mozilla.org/en-US/docs/Tools/Debugger) as if the JavaScript were not bundled. You should typically use developer mode when implementing and testing your study.
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
