import { createContext, useContext, useEffect, useState } from "react";

export interface AttributionDataContext {
  // Attribution codes from local storage.
  allAttributionCodes: URLSearchParams;

  // Loading flag for all attribution info.
  isAttributionLoaded: boolean;

  // Get current attribution codes as URLSearchParams.
  getAttributionCodes(): URLSearchParams;

  // Set attribution codes in query string of a provided URL.
  setAttributionCodes(url: URL): URL;
}

const AttributionContext = createContext<AttributionDataContext>(
  {} as AttributionDataContext
);

export function useAttribution() {
  return useContext(AttributionContext);
}

export function AttributionProvider(props: { children: React.ReactNode }) {
  const [isAttributionLoaded, setIsLoaded] = useState(false);
  const [allAttributionCodes, setAllAttributionCodes] =
    useState<URLSearchParams>(new URLSearchParams());

  async function loadAllAttributionCodes() {
    // Add UTM codes to store links, if present.
    let utmParams = new URLSearchParams();
    if (typeof window !== "undefined") {
      const utmKeys = ["source", "medium", "campaign", "term", "content"];

      // Use "last-click" attribution, overwriting any stored UTM codes if new ones are encountered.
      const storedParams = window.localStorage.getItem("rally_utm");
      if (storedParams) {
        utmParams = new URLSearchParams(storedParams);
      }

      const searchParams = new URL(window.location.href).searchParams;
      utmKeys.forEach((key) => {
        const utmKey = `utm_${key}`;
        searchParams.has(utmKey) &&
          utmParams.set(utmKey, searchParams.get(utmKey) ?? "");
      });
      window.localStorage.setItem("rally_utm", utmParams.toString());
    }
    setAllAttributionCodes(utmParams);

    setIsLoaded(true);
  }

  function getAttributionCodes() {
    const search = window.localStorage.getItem("rally_utm") ?? "";
    const searchParams = new URLSearchParams(search);

    return searchParams;
  }

  function setAttributionCodes(url: URL) {
    const returnUrl = new URL(url.href);

    if (typeof window !== "undefined") {
      const utmParams = new URLSearchParams(
        window.localStorage.getItem("rally_utm") ?? ""
      );
      ["source", "medium", "campaign", "term", "content"].forEach((key) => {
        const utmKey = `utm_${key}`;
        if (utmParams.has(utmKey)) {
          returnUrl.searchParams.set(utmKey, utmParams.get(utmKey) ?? "");
        }
      });
    }

    return returnUrl;
  }

  useEffect(() => {
    loadAllAttributionCodes();
  }, []);

  return (
    <AttributionContext.Provider
      value={{
        isAttributionLoaded,
        allAttributionCodes,
        setAttributionCodes,
        getAttributionCodes,
      }}
    >
      {props.children}
    </AttributionContext.Provider>
  );
}
