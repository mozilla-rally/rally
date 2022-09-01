import * as traverse from "../traverseFishing";
import getAboutThisAdUrl from "./getAboutThisAdUrl";
import getDestinationUrl from "./getDestinationUrl";

const sanitizeBannerPromo = (adData) => {
  // Grab the "About This Ad" URL before any sanitizing in case it gets lost
  const aboutThisAdUrl_SENSITIVE = getAboutThisAdUrl(adData);

  // Remove fields that are purely for UI
  traverse.fishForAndDeleteAll(["dismissButton"], adData);

  // Extract useful details
  const [adVideoId] = traverse.fishForAll(["adVideoId", "externalVideoId"], adData);
  const {
    promoText: { runs: [{ text: title = undefined }] } = { runs: [{}] },
  } = adData;
  const destinationUrl = getDestinationUrl(adData);

  return {
    type: "bannerPromo",
    adVideoId,
    aboutThisAdUrl_SENSITIVE,
    title,
    destinationUrl,
    // Still keep the raw object
    rawData: adData,
  };
};

export default sanitizeBannerPromo;
