import * as traverse from "./traverseFishing";

const extractRecommendations = ({ body }) => {
  const renderers = traverse.fishForAll(
    ["compactVideoRenderer", "videoRenderer" /*, "reelItemRenderer"*/], // leave out Reels/Shorts for now
    body
  );
  if (renderers.length > 0) {
    return renderers.filter(hasVideoId).map(sanitizeRecommendation);
  }
  return null;
};

export default extractRecommendations;

// Some compactVideoRenderers have no top-level videoId
// these are not algorithmic recommendations and can be ignored
const hasVideoId = (rec) => rec.videoId;

const sanitizeRecommendation = (rec) => {
  // Remove fields that are purely for UI
  traverse.fishForAndDeleteAll(["menu", "thumbnailOverlays"], rec);

  // Extract useful details
  // via nested destructuring
  // (requires lots of default assignments)
  const {
    videoId,
    descriptionSnippet: {
      runs: [{ text: descriptionSnippet = undefined }] = [{}],
    } = {},
    viewCountText: { simpleText: viewCountText = undefined } = {},
    lengthText: { simpleText: lengthText = undefined } = {},
    ownerBadges: authorBadges = [],
    badges: videoBadges = [],
    longBylineText: {
      runs: [
        {
          text: author = undefined,
          navigationEndpoint: {
            browseEndpoint: {
              browseId: authorChannelId = undefined,
              canonicalBaseUrl: authorChannelPath = undefined,
            } = {},
          } = {},
        },
      ] = [{}],
    } = {},
  } = rec;

  // the title is reported differently for
  // compactVideoRenderer vs videoRenderer vs reelItemRenderer
  // (leaving out reelItemRenderer titles for now)
  const title =
    rec.title.simpleText ||
    rec.title.runs[0].text; /* || rec.headline.simpleText */

  return {
    videoId,
    title,
    descriptionSnippet,
    viewCountText,
    lengthText,
    author,
    authorChannelId,
    authorChannelPath,
    authorBadges: authorBadges.map(
      ({ metadataBadgeRenderer: { tooltip } }) => tooltip
    ),
    videoBadges: videoBadges.map(
      ({ metadataBadgeRenderer: { label } }) => label
    ),
    // Still keep the raw object
    rawData: rec,
  };
};
