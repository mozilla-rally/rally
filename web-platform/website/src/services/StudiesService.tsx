import { Study } from "@mozilla/rally-shared-types";
import { collection, getDocs } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

import { useAttribution } from "./AttributionService";
import { dispose, initializeExtensionEvents } from "./ExtensionsEventService";
import { useFirebase } from "./FirebaseService";

export interface StudiesDataContext {
  // All the studies from the database
  allStudies: Study[];

  // Locally installed studies obtained from extensions
  installedStudyIds: string[];

  // Loading flag for all studies
  isLoaded: boolean;

  // Specific study object for the Rally Extension
  rallyExtensionStudy: Study | undefined;
}

const RALLY_EXTENSION_STUDY_ID = "attentionStream";

const StudiesContext = createContext<StudiesDataContext>(
  {} as StudiesDataContext
);

export function useStudies() {
  return useContext(StudiesContext);
}

export function StudiesProvider(props: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [allStudies, setAllStudies] = useState<Study[]>([]);
  const [installedStudyIds, setInstalledStudyIds] = useState<string[]>([]);
  const [rallyExtensionStudy, setRallyExtensionStudy] = useState<Study>();
  const { db } = useFirebase();

  function subscribeToExtensionEvents() {
    initializeExtensionEvents({
      onStudyInstalled: (studyId) => {
        setInstalledStudyIds((ids) => {
          if (!ids.includes(studyId)) {
            return [...ids, studyId];
          }

          return ids;
        });
      },
    });
  }

  const { setAttributionCodes } = useAttribution();

  async function loadAllStudies() {
    const studies = (await getDocs(collection(db, "studies"))).docs.map(
      (doc) => doc.data() as Study
    );

    // If any attribution codes are stored in local storage, apply them to these outbound links.
    studies.forEach((study) => {
      if (study.studyId === RALLY_EXTENSION_STUDY_ID) {
        setRallyExtensionStudy(study);
      }
      if (
        !study.downloadLink ||
        !study.downloadLink.chrome ||
        !study.downloadLink.firefox
      ) {
        return;
      }

      const chromeUrl = setAttributionCodes(new URL(study.downloadLink.chrome));
      const firefoxUrl = setAttributionCodes(
        new URL(study.downloadLink.firefox)
      );

      study.downloadLink.chrome = chromeUrl.toString();
      study.downloadLink.firefox = firefoxUrl.toString();
    });

    setAllStudies(studies);
    setIsLoaded(true);
  }

  useEffect(() => {
    loadAllStudies();
    subscribeToExtensionEvents();
    return dispose;
  }, []);

  return (
    <StudiesContext.Provider
      value={{ isLoaded, allStudies, installedStudyIds, rallyExtensionStudy }}
    >
      {props.children}
    </StudiesContext.Provider>
  );
}
