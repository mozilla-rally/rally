import * as traverse from "../traverseFishing";
import getAboutThisAdUrl from "./getAboutThisAdUrl";
import getDestinationUrl from "./getDestinationUrl";

const sanitizeDisplayAd = (adData) => {
  // Grab the "About This Ad" URL before any sanitizing in case it gets lost
  const aboutThisAdUrl_SENSITIVE = getAboutThisAdUrl(adData);

  // Remove fields that are purely for UI
  traverse.fishForAndDeleteAll(["menu"], adData);

  // Extract useful details
  const adVideoId = adData.adVideoId || adData.externalVideoId;
  const title = adData.titleText?.simpleText;
  const body = adData.bodyText?.simpleText;
  const description = adData.secondaryText?.simpleText;
  const destinationUrl = getDestinationUrl(adData);

  return {
    type: "displayAd",
    adVideoId,
    aboutThisAdUrl_SENSITIVE,
    title,
    body,
    description,
    destinationUrl,
    // Still keep the raw object
    rawData: adData,
  };
};

export default sanitizeDisplayAd;
