import * as AD_SANITIZERS from "./ad-sanitizers";
import * as traverse from "./traverseFishing";
import extractAboutThisAd from "./extractAboutThisAd";

// Use AD_SANITIZERS to get list of all supported "ad types"
const ALL_AD_TYPES = Object.keys(AD_SANITIZERS);

const extractAds = async ({ body }) => {
  // Get all ads of all types
  let ads = traverse.fishForAll(
    ALL_AD_TYPES,
    body,
    true /* keep ad types in return value */
  );
  const aboutThisAdCached = {};

  // Apply the appropriate sanitizer from AD_SANITIZERS
  ads = ads.map(([adType, adData]) => {
    const adSanitizer = AD_SANITIZERS[adType];
    return adSanitizer(adData);
  });

  // Fetch "About This Ad" info
  for (let ad of ads) {
    if (ad.aboutThisAdUrl_SENSITIVE) {
      try {
        // Check for cached response
        // (sometimes multiple ads on the same page have the same About This Ad URL)
        let aboutThisAd = aboutThisAdCached[ad.aboutThisAdUrl_SENSITIVE];
        if (!aboutThisAd) {
          const resp = await fetch(ad.aboutThisAdUrl_SENSITIVE);
          const html = await resp.text();
          aboutThisAd = extractAboutThisAd(html);
          aboutThisAdCached[ad.aboutThisAdUrl_SENSITIVE] = aboutThisAd; // now cache it
        }
        ad.targetingReasons = aboutThisAd.targetingReasons;
        ad.advertiserInfo = aboutThisAd.advertiserInfo;
      } catch (err) {
        console.error(`Error while fetching "About This Ad" info:`, err);
      }
    }
    // The URL is highly sensitive (has some auth information)
    // and should not be sent anywhere
    delete ad.aboutThisAdUrl_SENSITIVE;
  }

  if (ads.length > 0) {
    return { ads };
  }
  return null;
};

export default extractAds;
