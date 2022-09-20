import manifestTemplate from "../manifest-template.json" assert { type: "json" };
import fs from "fs/promises";
import minimist from "minimist";
import pkg from "typescript";
const { sys } = pkg;


const args = minimist(process.argv.slice(2));

async function main(manifestVersion, browser) {
  const manifest = manifestTemplate;
  manifest["manifest_version"] = manifestVersion;

  if (!["firefox", "chrome"].includes(browser)) {
    throw new Error(`unknown browser: ${browser}`);
  }

  if (browser === "firefox") {
    manifest["browser_specific_settings"] = {
      gecko: {
        id: "attention-stream@rally.mozilla.org",
        strict_min_version: "101.0",
      },
    };
  }

  switch (manifestVersion) {
    case 2: {
      manifest["browser_action"] = {
        default_icon: "images/RallyFlag-green.png",
        default_title: "Rally Attention Stream",
      };

      manifest["background"] = {
        scripts: ["dist/background.js"],
      };

      manifest["web_accessible_resources"] = ["dist/youtube/yt.injected.js"];

      manifest["permissions"].push("<all_urls>");

      break;
    }

    case 3: {
      manifest["action"] = {
        default_icon: {
          128: "images/RallyFlag.png"
        },
        default_title: "Rally Attention Stream",
      };

      manifest["background"] = {
        service_worker: "dist/background-loader.js",
      };

      manifest["web_accessible_resources"] = [
        {
          resources: ["dist/youtube/yt.injected.js"],
          matches: ["*://*.youtube.com/*"],
        },
      ];

      manifest["host_permissions"] = ["<all_urls>"];

      break;
    }
    default: {
      throw new Error("unknown manifest version");
    }
  }

  return manifest;
}

const manifestVersion = args["manifest-version"];
const browser = args["browser"];

if (manifestVersion && browser) {
  main(manifestVersion, browser)
    .then(async (res) => {
      fs.writeFile("manifest.json", JSON.stringify(res, null, 2));
    })
    .catch((err) => {
      throw err;
    });
} else {
  console.error("Error: --manifest-version and --browser are required");
  sys.exit(1);
}
