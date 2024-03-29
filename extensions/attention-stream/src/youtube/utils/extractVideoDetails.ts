import * as traverse from "./traverseFishing";
import parseVideoId from "./parseVideoId";

const extractVideoDetails = ({ body, hostUrl }) => {
  const videoIdFromUrl = hostUrl && parseVideoId(hostUrl);

  // Make sure the videoDetails objects matches with the current page's videoId
  // (it could be from a hover preload, in which case we want to discard)
  if (
    body &&
    body.videoDetails &&
    body.videoDetails.videoId === videoIdFromUrl
  ) {
    // Extract useful details
    // via destructuring
    const {
      author,
      channelId: authorChannelId,
      isLiveContent,
      isPrivate,
      keywords,
      lengthSeconds,
      shortDescription,
      title,
      videoId,
      viewCount,
    } = body.videoDetails;

    if (isPrivate) {
      throw new Error(
        "Non-Critical Error - Private Video: encountered a private video; aborting all extraction..."
      );
    }

    const containsSponsoredContent = !!traverse.fishFor("paidContentOverlay", body);

    return {
      author,
      authorChannelId,
      isLiveContent,
      containsSponsoredContent,
      keywords: keywords?.slice(0, 20), // Glean limits string arrays to length of 20
      length: parseInt(lengthSeconds),
      description: shortDescription,
      title,
      videoId,
      viewCount: parseInt(viewCount),
      // Still keep the raw object
      rawData: body.videoDetails,
    };
  }
  return null;
};

export default extractVideoDetails;
