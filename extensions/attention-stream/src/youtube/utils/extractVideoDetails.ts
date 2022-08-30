import parseVideoId from "./parseVideoId";

const extractVideoDetails = ({ body, url, hostUrl }) => {
  const videoIdFromUrl = hostUrl && parseVideoId(hostUrl);

  // Make sure the videoDetails objects matches with the current page's videoId
  // (it could be from a hover preload, in which case we want to discard)
  if (
    body &&
    body.videoDetails &&
    body.videoDetails.videoId === videoIdFromUrl
  ) {
    const {
      author,
      channelId,
      isLiveContent,
      isPrivate,
      keywords,
      lengthSeconds,
      shortDescription,
      title,
      videoId,
      viewCount,
    } = body.videoDetails;

    return {
      // Extract common details
      author,
      channelId,
      isLiveContent,
      isPrivate,
      keywords,
      lengthSeconds,
      shortDescription,
      title,
      videoId,
      viewCount,
      // Still keep the raw object
      raw: body.videoDetails
    };
  }
  return null;
};

export default extractVideoDetails;
