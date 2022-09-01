import * as AD_SANITIZERS from "./ad-sanitizers";
import * as traverse from "./traverseFishing";

// Use AD_SANITIZERS to get list of all supported "ad types"
const ALL_AD_TYPES = Object.keys(AD_SANITIZERS);

const extractAds = ({ body }) => {
  // Get all ads of all types
  let ads = traverse.fishForAll(
    ALL_AD_TYPES,
    body,
    true  /* keep ad types in return value */
  );

  // Apply the appropriate sanitizer from AD_SANITIZERS
  ads = ads.map(([adType, adData]) => {
    const adSanitizer = AD_SANITIZERS[adType];
    return adSanitizer(adData);
  });

  if (ads.length > 0) {
    return ads;
  }
  return null;
};

export default extractAds;
