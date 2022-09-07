import * as traverse from "../traverseFishing";
import getAboutThisAdUrl from "./getAboutThisAdUrl";
import getDestinationUrl from "./getDestinationUrl";

const sanitizeAdsEngagementPanel = (adData) => {
  // Grab the "About This Ad" URL before any sanitizing in case it gets lost
  const aboutThisAdUrl_SENSITIVE = getAboutThisAdUrl(adData);

  // Remove fields that are purely for UI
  traverse.fishForAndDeleteAll(["adInfoRenderer", "expandAction", "collapseAction", "hideAction", "removeAction"], adData);

  // Extract useful details
  const adVideoId = adData.adVideoId || adData.externalVideoId;
  const { simpleText: title } = traverse.fishFor("title", adData) || {};
  const { simpleText: description } = traverse.fishFor("subtitle", adData) || {};
  const destinationUrl = getDestinationUrl(adData);

  return {
    type: "adsEngagementPanel",
    adVideoId,
    aboutThisAdUrl_SENSITIVE,
    title,
    description,
    destinationUrl,
    // Still keep the raw object
    rawData: adData,
  };
};

export default sanitizeAdsEngagementPanel;
