import * as traverse from "../traverseFishing";
import getDestinationUrl from "./getDestinationUrl";

const sanitizeAdActionInterstitial = (adData) => {
  // Remove fields that are purely for UI
  traverse.fishForAndDeleteAll(["skipButton"], adData);

  // Extract useful details
  const adVideoId = adData.adVideoId || adData.externalVideoId;
  const { text: title } = traverse.fishFor("headline", adData) || {};
  const { text: description } = traverse.fishFor("description", adData) || {};
  const destinationUrl = getDestinationUrl(adData);

  return {
    type: "adActionInterstitial",
    adVideoId,
    title,
    description,
    destinationUrl,
    // Still keep the raw object
    rawData: adData,
  };
};

export default sanitizeAdActionInterstitial;
