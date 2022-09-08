import * as traverse from "../traverseFishing";

const getAboutThisAdUrl = (adData) => {
  const aboutThisAdRenderer = traverse.fishFor("aboutThisAdRenderer", adData);
  return aboutThisAdRenderer?.url
    ?.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue;
};

export default getAboutThisAdUrl;
