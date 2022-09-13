import * as webScience from "@mozilla/web-science";

interface TrackingPixel {
  type: string;
  matchPatternUrls: string[];
  matchPatternSet?: webScience.matching.MatchPatternSet;
}

const trackingPixels: TrackingPixel[] = [
  {
    type: "meta",
    matchPatternUrls: ["*://www.facebook.com/tr*"],
  },
  {
    type: "google-analytics",
    matchPatternUrls: [
      "*://www.google-analytics.com/*collect*",
      "*://www.google.com/ads/ga-audiences*",
    ],
  },
  {
    type: "google-ads",
    matchPatternUrls: [
      "*://*.doubleclick.net/*pixel*",
      "*://*.doubleclick.net/*collect*",
      "*://*.fls.doubleclick.net/*",
      "*://*.doubleclick.net/pagead/viewthroughconversion/*",
    ],
  },
  {
    type: "moat",
    matchPatternUrls: [
      "*://px.moatads.com/pixel*",
    ],
  },
  {
    type: "twitter",
    matchPatternUrls: [
      "*://t.co/*adsct*",
      "*://analytics.twitter.com/*adsct*",
      "*://ads-api.twitter.com/measurement*",
    ],
  },
  {
    type: "tiktok",
    matchPatternUrls: [
      "*://analytics.tiktok.com/*pixel*",
      "*://analytics.tiktok.com/*monitor*",
    ],
  },
  {
    type: "snapchat",
    matchPatternUrls: [
      "*://tr.snapchat.com/p*",
    ],
  },
  {
    type: "pinterest",
    matchPatternUrls: [
      "*://ct.pinterest.com/*",
    ],
  },
];

export function getTrackingPixelInfo(enableDevMode = false) {
  if (enableDevMode) {
    trackingPixels.push({
      type: "dev",
      matchPatternUrls: ["*://localhost/trackingtest*"],
    });
  }
  
  const trackingPixelUrls = trackingPixels.reduce((prev, curr) => {
    curr.matchPatternSet = webScience.matching.createMatchPatternSet(
      curr.matchPatternUrls
    );
    return prev.concat(curr.matchPatternUrls);
  }, []);

  return {trackingPixels, trackingPixelUrls};
}