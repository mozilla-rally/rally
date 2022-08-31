import validate from "./utils/validate";

import extractVideoDetails from "./utils/extractVideoDetails";
import extractRecommendations from "./utils/extractRecommendations";

// Listen for messages from the injected script on YouTube
window.addEventListener("message", ({ source, data }) => {
  if (source === window) {
    try {
      validate(data);
      console.time("mozilla-rally-yt-scanner");

      // Not every message will have info in each category.
      // Each category's handler is responsible for returning null
      // as soon as it knows it won't find anything.
      const videoDetails = extractVideoDetails({ ...data });
      // const ads = extractAds({...data});
      const recommendations = extractRecommendations({ ...data });

      videoDetails &&
        console.log("Mozilla Rally: found current video details", videoDetails);
      recommendations &&
        console.log(
          "Mozilla Rally: found video recommendations on this page",
          recommendations
        );
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
