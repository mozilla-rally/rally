import { UserDocument } from "@mozilla/rally-shared-types/dist/UserDocument";
import { createContext, useContext, useEffect, useState } from "react";

import { useAuthentication } from "./AuthenticationService";
import { useUserDocument } from "./UserDocumentService";

const utmKeys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
];

export interface AttributionDataContext {
  // Attribution codes from local storage.
  allAttributionCodes: URLSearchParams;

  // Loading flag for all attribution info.
  isAttributionLoaded: boolean;

  // Get current attribution codes as URLSearchParams.
  getAttributionCodes(): URLSearchParams | undefined;

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

  const { userDocument, updateUserDocument, isDocumentLoaded } =
    useUserDocument();
  const { user } = useAuthentication();

  function loadAllAttributionCodes() {
    function updateUserAttribution(document: Record<string, string>) {
      if (!user) {
        return;
      }

      updateUserDocument({
        attribution: document,
      } as Partial<UserDocument>);
    }

    /**
     * Returns attribution (UTM) codes from the query string or local storage,
     * preferring local storage.
     *
     * @returns <URLSearchParams> Attribution query string
     */
    function loadFromLocalStorageOrQueryString() {
      // Add UTM codes to store links, if present.
      let utmParams = new URLSearchParams();

      if (typeof window !== "undefined") {
        // Use "first-click" attribution, keeping any stored UTM codes if new ones are encountered.
        const searchParams = new URL(window.location.href).searchParams;
        utmKeys.forEach((key) => {
          searchParams.has(key) &&
            utmParams.set(key, searchParams.get(key) ?? "");
        });

        const storedParams = new URLSearchParams(
          window.localStorage.getItem("rally_utm") || ""
        );
        if (storedParams) {
          utmKeys.forEach((key) => {
            storedParams.has(key) &&
              utmParams.set(key, storedParams.get(key) ?? "");
          });
        }
      }

      return utmParams;
    }

    let attribution = new URLSearchParams();

    if (userDocument && userDocument.attribution) {
      for (const utmKey in userDocument.attribution) {
        attribution.set(utmKey, userDocument.attribution[utmKey]);
      }

      // Ensure that local storage is set to match firestore.
      window.localStorage.setItem("rally_utm", attribution.toString());
    } else {
      attribution = loadFromLocalStorageOrQueryString();
      const attributionDoc: any = {};
      attribution.forEach((value, key) => {
        attributionDoc[key] = value;
      });

      updateUserAttribution(attributionDoc);

      // Ensure that local storage is set to the query string.
      window.localStorage.setItem("rally_utm", attribution.toString());
    }

    setAllAttributionCodes(attribution);

    setIsLoaded(true);
  }

  function getAttributionCodes() {
    if (!isAttributionLoaded) {
      return;
    }
    const search = window.localStorage.getItem("rally_utm") ?? "";
    const searchParams = new URLSearchParams(search);

    return searchParams;
  }

  function setAttributionCodes(url: URL) {
    const returnUrl = new URL(url.href);

    if (typeof window !== "undefined") {
      const storedParams = new URLSearchParams(
        window.localStorage.getItem("rally_utm") ?? ""
      );
      utmKeys.forEach((key) => {
        if (storedParams.has(key)) {
          returnUrl.searchParams.set(key, storedParams.get(key) ?? "");
        }
      });
    }

    return returnUrl;
  }

  useEffect(() => {
    if (isDocumentLoaded) {
      loadAllAttributionCodes();
    }
  }, [isDocumentLoaded]);

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
