import * as traverse from "../traverseFishing";
import getAboutThisAdUrl from "./getAboutThisAdUrl";
import getDestinationUrl from "./getDestinationUrl";

const sanitizeActionCompanionAd = (adData) => {
  // Grab the "About This Ad" URL before any sanitizing in case it gets lost
  const aboutThisAdUrl_SENSITIVE = getAboutThisAdUrl(adData);

  // Remove fields that are purely for UI
  traverse.fishForAndDeleteAll(["adInfoRenderer"], adData);

  // Extract useful details
  const adVideoId = adData.adVideoId || adData.externalVideoId;
  const { text: title } = traverse.fishFor("headline", adData) || {};
  const { text: description } = traverse.fishFor("description", adData) || {};
  const destinationUrl = getDestinationUrl(adData);

  return {
    type: "actionCompanionAd",
    adVideoId,
    aboutThisAdUrl_SENSITIVE,
    title,
    description,
    destinationUrl,
    // Still keep the raw object
    rawData: adData,
  };
};

export default sanitizeActionCompanionAd;
