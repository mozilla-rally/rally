import * as traverse from "../traverseFishing";
import getAboutThisAdUrl from "./getAboutThisAdUrl";
import getDestinationUrl from "./getDestinationUrl";

const sanitizeInstreamVideoAd = (adData) => {
  // Grab the "About This Ad" URL before any sanitizing in case it gets lost
  const aboutThisAdUrl_SENSITIVE = getAboutThisAdUrl(adData);

  // Remove fields that are purely for UI
  traverse.fishForAndDeleteAll(
    ["skipOrPreviewRenderer", "adDurationRemaining", "adInfoRenderer"],
    adData
  );

  // Extract useful details
  const adVideoId = adData.adVideoId || adData.externalVideoId;
  const visitAdvertiserRenderer =
    traverse.fishFor("visitAdvertiserRenderer", adData) || {};
  const {
    buttonRenderer: {
      text: { runs: [{ text: advertiser = undefined }] = [{}] } = {},
    } = {},
  } = visitAdvertiserRenderer;
  const { text: title } = traverse.fishFor("headline", adData) || {};
  const { text: description } = traverse.fishFor("description", adData) || {};
  const destinationUrl = getDestinationUrl(adData);

  return {
    type: "instreamVideoAd",
    adVideoId,
    advertiser,
    aboutThisAdUrl_SENSITIVE,
    title,
    description,
    destinationUrl,
    // Still keep the raw object
    rawData: adData,
  };
};

export default sanitizeInstreamVideoAd;
