export const studies = {
  facebookPixelHunt: {
    name: "Facebook Pixel Hunt",
    icons: {
      "32": "https://addons.mozilla.org/user-media/addon_icons/2732/2732005-32.png",
      "64": "https://addons.mozilla.org/user-media/addon_icons/2732/2732005-64.png",
      "128":
        "https://addons.mozilla.org/user-media/addon_icons/2732/2732005-128.png",
    },
    authors: {
      name: "Mozilla Rally and the Markup",
    },
    version: "0.2.6",
    firefoxAddonId: "facebook-pixel-hunt@rally.mozilla.org",
    chromeExtensionId: "pbeklachfkbjddmglcccopmknmpfchdm",
    studyId: "facebookPixelHunt",
    schemaNamespace: "rally-markup-fb-pixel-hunt",
    downloadLink:
      "https://chrome.google.com/webstore/detail/facebook-pixel-hunt/pbeklachfkbjddmglcccopmknmpfchdm",
    endDate: "2022-07-13",
    studyEnded: false,
    studyPaused: false,
    description:
      "According to its own policy, Facebook may collect information about you across the web even if you don\u2019t have a Facebook account. One way Facebook performs this tracking is through a network of \u201Cpixels\u201D that may be installed on many of the sites you visit. By joining this study, you will help Rally and The Markup investigate and report on where Facebook is tracking you and what kind of information they are collecting.",
    studyDetailsLink:
      "https://rally.mozilla.org/current-studies/facebook-pixel-hunt/index.html",
    dataCollectionDetails: [
      "The data sent to Facebook through Facebook Pixels",
      "The URLs of the web pages you browse",
      "The time you spend browsing pages",
      "The presence of Facebook login cookies in your browser",
      "A study survey that the user completes",
    ],
    tags: ["social media"],
  },
  attentionStream: {
    name: "Attention Stream",
    icons: {
      "32": "/img/icon-mozilla-32x32.png",
      "64": "/img/icon-mozilla-64x64.png",
      "128": "/img/icon-mozilla-128x128.png",
    },
    authors: {
      name: "Mozilla Rally",
    },
    version: "0.4.3",
    firefoxAddonId: "attention-stream@rally.mozilla.org",
    chromeExtensionId: "bahhehaddofgkccippmjcecepdakppme",
    studyId: "attentionStream",
    schemaNamespace: "rally-attention-stream",
    downloadLink:
      "https://chrome.google.com/webstore/detail/attention-stream/bahhehaddofgkccippmjcecepdakppme",
    endDate: "2022-07-13",
    studyEnded: false,
    studyPaused: false,
    description:
      "Join the Mozilla Rally community and help Rally and our partners build a user-centric understanding of what’s happening online! The Attention Stream provides a picture of how information spreads across the web and big tech platforms, where people spend their time, and how these platforms influence people. Rally and our partners will publicly share research findings and any discoveries that could enable more privacy and control in consumer products. We will always inform you of which partners have access to the Attention Stream and whenever new partners join. We also will always disclose if research partners compensate Mozilla for access to Attention Stream data. ",
    studyDetailsLink:
      "https://rally.mozilla.org/current-studies/attention-stream/index.html",
    dataCollectionDetails: [
      "Visits to web page URLs",
      "Time spent on urls",
      "Time spent playing media on each webpage",
      "On certain news pages the full text of the article and the size of ads on the article’s webpage",
      "Your Rally demographics",
    ],
    tags: ["media monitoring", "social media", "transparency"],
  },
};
