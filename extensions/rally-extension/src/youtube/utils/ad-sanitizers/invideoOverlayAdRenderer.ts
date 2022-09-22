import * as traverse from "../traverseFishing";
import getAboutThisAdUrl from "./getAboutThisAdUrl";
import getDestinationUrl from "./getDestinationUrl";

const sanitizeInvideoOverlayAd = (adData) => {
  // Grab the "About This Ad" URL before any sanitizing in case it gets lost
  const aboutThisAdUrl_SENSITIVE = getAboutThisAdUrl(adData);

  // Remove fields that are purely for UI
  traverse.fishForAndDeleteAll(["adInfoRenderer"], adData);

  // Extract useful details
  const destinationUrl = getDestinationUrl(adData);

  return {
    type: "invideoOverlayAd",
    aboutThisAdUrl_SENSITIVE,
    destinationUrl,
    // Still keep the raw object
    rawData: adData,
  };
};

export default sanitizeInvideoOverlayAd;
