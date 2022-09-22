import validate from "./utils/validate";
import * as traverse from "./utils/traverseFishing";

import extractVideoDetails from "./utils/extractVideoDetails";
import extractRecommendations from "./utils/extractRecommendations";
import extractAds from "./utils/extractAds";

// Listen for messages from the injected script on YouTube
const listenForMessages = () => {
  const pageManager = window.webScience.pageManager;

  const sendToBackground = (data, url, type) => {
    // One last scrub to remove sensitive URLs
    traverse.fishForAndDeleteAll(
      ["privateDoNotAccessOrElseTrustedResourceUrlWrappedValue"],
      data
    );

    browser.runtime.sendMessage({
      type: `MozillaRally.YouTube.${type}`,
      pageId: pageManager.pageId,
      url: url,
      ...data,
    });
  };

  window.addEventListener("message", async ({ source, data }) => {
    if (source === window) {
      try {
        validate(data);
        console.time("mozilla-rally-yt-scanner");

        // Not every message will have info in each category.
        // Each category's handler is responsible for returning null
        // if nothing is found

        // Current Video Details
        const videoDetails = extractVideoDetails({ ...data });
        if (videoDetails) {
          console.log(
            "Mozilla Rally: found current video details",
            videoDetails
          );
          sendToBackground(videoDetails, data.hostUrl, "videodetails");
        }

        // Algorithmic video recommendations
        const recommendations = extractRecommendations({ ...data });
        if (recommendations) {
          console.log(
            "Mozilla Rally: found video recommendations on this page",
            recommendations
          );
          sendToBackground(recommendations, data.hostUrl, "recommendations");
        }

        // Ads
        extractAds({ ...data }).then((ads) => {
          // Async callback because getting "About This Ad" info
          // requires a fetch
          if (ads) {
            console.log("Mozilla Rally: found ads on this page", ads);
            sendToBackground(ads, data.hostUrl, "ads");
          }
        });

        console.timeEnd("mozilla-rally-yt-scanner");
      } catch (err) {
        if (!err.toString().includes("Non-Critical Error")) {
          console.debug("Unexpected Error!");
          console.error(err);
          console.timeEnd("mozilla-rally-yt-scanner");
        }
      }
    }
  });
};

// Wait for pageManager load
if ("webScience" in window && "pageManager" in window.webScience) {
  listenForMessages();
} else {
  if (!("pageManagerHasLoaded" in window)) {
    window.pageManagerHasLoaded = [];
  }
  window.pageManagerHasLoaded.push(listenForMessages);
}
