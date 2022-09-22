// This "destination URL" is often a doubleclick.net or googleadservices link

import * as traverse from "../traverseFishing";

const getDestinationUrl = (adData) => {
  // Find a urlEndpoint that has a target of TARGET_NEW_WINDOW
  const [{ url: destinationUrl = undefined } = {}] = traverse
  .fishForAll(["urlEndpoint"], adData)
  .filter((endpoint) => endpoint.target === "TARGET_NEW_WINDOW") || [];
  return destinationUrl;
};

export default getDestinationUrl;
