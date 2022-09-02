import validate from "./utils/validate";

import extractVideoDetails from "./utils/extractVideoDetails";
import extractRecommendations from "./utils/extractRecommendations";
import extractAds from "./utils/extractAds";

// Listen for messages from the injected script on YouTube
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
      videoDetails &&
        console.log("Mozilla Rally: found current video details", videoDetails);

      // Algorithmic video recommendations
      const recommendations = extractRecommendations({ ...data });
      recommendations &&
        console.log(
          "Mozilla Rally: found video recommendations on this page",
          recommendations
        );

      // Ads
      extractAds({ ...data }).then((ads) => {
        // Async callback because getting "About This Ad" info
        // requires a fetch
        ads && console.log("Mozilla Rally: found ads on this page", ads);
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
