import * as traverse from "../traverseFishing";
import getAboutThisAdUrl from "./getAboutThisAdUrl";
import getDestinationUrl from "./getDestinationUrl";

const sanitizePageTopAd = (adData) => {
  // Grab the "About This Ad" URL before any sanitizing in case it gets lost
  const aboutThisAdUrl_SENSITIVE = getAboutThisAdUrl(adData);

  // Remove fields that are purely for UI
  traverse.fishForAndDeleteAll(
    ["menu", "adInfoRenderer"],
    adData
  );

  // Extract useful details
  const [adVideoId] = traverse.fishForAll(["videoId"], adData);
  const { simpleText: title } = traverse.fishFor("title", adData) || {};
  const { runs: [{ text: description = undefined } = {}] = [] } =
    traverse.fishFor("byline", adData) || {};

  const destinationUrl = getDestinationUrl(adData);

  return {
    type: "pageTopAd",
    adVideoId,
    aboutThisAdUrl_SENSITIVE,
    title,
    description,
    destinationUrl,
    // Still keep the raw object
    rawData: adData,
  };
};

export default sanitizePageTopAd;
