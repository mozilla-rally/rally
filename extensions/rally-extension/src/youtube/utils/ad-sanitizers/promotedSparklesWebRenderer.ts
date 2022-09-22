import * as traverse from "../traverseFishing";
import getAboutThisAdUrl from "./getAboutThisAdUrl";
import getDestinationUrl from "./getDestinationUrl";

const sanitizePromotedSparklesWeb = (adData) => {
  // Grab the "About This Ad" URL before any sanitizing in case it gets lost
  const aboutThisAdUrl_SENSITIVE = getAboutThisAdUrl(adData);

  // Remove fields that are purely for UI
  traverse.fishForAndDeleteAll(["menu", "adInfoRenderer"], adData);

  // Extract useful details
  const title = adData.title?.simpleText;
  const advertiserWebsite = adData.websiteText?.simpleText;
  const description = adData.description?.simpleText;
  const destinationUrl = getDestinationUrl(adData);

  return {
    type: "promotedSparklesWeb",
    aboutThisAdUrl_SENSITIVE,
    advertiserWebsite,
    title,
    description,
    destinationUrl,
    // Still keep the raw object
    rawData: adData,
  };
};

export default sanitizePromotedSparklesWeb;
