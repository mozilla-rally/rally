import * as traverse from "../traverseFishing";
import getAboutThisAdUrl from "./getAboutThisAdUrl";

const sanitizeCompactPromotedVideo = (adData) => {
  // Grab the "About This Ad" URL before any sanitizing in case it gets lost
  const aboutThisAdUrl_SENSITIVE = getAboutThisAdUrl(adData);

  // Remove fields that are purely for UI
  traverse.fishForAndDeleteAll(
    ["menu", "adInfoRenderer"],
    adData
  );

  // Extract useful details
  const adVideoId = adData.videoId;
  const title = adData.title?.simpleText;

  return {
    type: "compactPromotedVideo",
    adVideoId,
    aboutThisAdUrl_SENSITIVE,
    title,
    // Still keep the raw object
    rawData: adData,
  };
};

export default sanitizeCompactPromotedVideo;
