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
    downloadLink: {
      chrome:
        "https://chrome.google.com/webstore/detail/facebook-pixel-hunt/pbeklachfkbjddmglcccopmknmpfchdm",
      firefox:
        "https://addons.mozilla.org/en-US/firefox/addon/facebook-pixel-hunt/",
    },
    endDate: "2022-07-13",
    studyEnded: false,
    studyPaused: true,
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
    name: "Mozilla Rally",
    icons: {
      "32": "https://addons.mozilla.org/user-media/addon_icons/2760/2760080-32.png",
      "64": "https://addons.mozilla.org/user-media/addon_icons/2760/2760080-64.png",
      "128":
        "https://addons.mozilla.org/user-media/addon_icons/2760/2760080-128.png",
    },
    authors: {
      name: "Mozilla Rally",
    },
    version: "0.5.0",
    firefoxAddonId: "attention-stream@rally.mozilla.org",
    chromeExtensionId: "bahhehaddofgkccippmjcecepdakppme",
    studyId: "attentionStream",
    schemaNamespace: "rally-attention-stream",
    downloadLink: {
      chrome:
        "https://chrome.google.com/webstore/detail/mozilla-rally/bahhehaddofgkccippmjcecepdakppme",
      firefox: "https://addons.mozilla.org/en-US/firefox/addon/mozilla-rally",
    },
    endDate: "Ongoing",
    studyEnded: false,
    studyPaused: false,
    description:
      "Your data contributions provide Rally and our research partners a cross-website view of the internet.  These contributions shed light on how information spreads, where people spend their time, and how tech platforms interact and recommend content to the Rally community.\n\nThe results will help Rally and our research partners understand users’ experiences, build better products, and gather evidence on how the web is working for users.  We will publicly share research findings and any discoveries that could enable more privacy and control in consumer products.\n\nWe will always inform you of which research partners have access to Rally data and whenever new partners join.  Some research partners compensate Rally for access to our infrastructure and data.  We will always disclose if research partners compensate Mozilla for access to Rally data.",
    studyDetailsLink:
      "https://rally.mozilla.org/current-studies/attention-stream/index.html",
    dataCollectionDetails: [
      "Visits to web page URLs",
      "Time spent on URLs",
      "Time spent playing media on each webpage",
      "Your Rally demographics",
      "On certain news pages the full text of the article and the size of ads on the article's webpage",
      "On certain media platforms, metadata about the content you view and algorithmic content recommendations you receive*",
      "The content and metadata of ads you are shown across the web*",
      "The data sent through various tracking pixels from the websites you visit*",
      "*If you joined prior to 9/23/2022, these measurements are excluded",
    ],
    tags: ["media monitoring", "social media", "transparency"],
  },
};
