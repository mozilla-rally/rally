import { Study } from "@mozilla/rally-shared-types";
import { logEvent } from "firebase/analytics";
import { collection, getDocs } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

import { dispose, initializeExtensionEvents } from "./ExtensionsEventService";
import { useFirebase } from "./FirebaseService";

export interface StudiesDataContext {
  // All the studies from the database
  allStudies: Study[];

  // Locally installed studies obtained from extensions
  installedStudyIds: string[];

  // Loading flag for all studies
  isLoaded: boolean;
}

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
  const { db } = useFirebase();

  function subscribeToExtensionEvents() {
    initializeExtensionEvents({
      onStudyInstalled: (studyId, attribution) => {
        logStudyInstalled(studyId, attribution);

        setInstalledStudyIds((ids) => {
          if (!ids.includes(studyId)) {
            return [...ids, studyId];
          }

          return ids;
        });
      },
    });
  }

  async function loadAllStudies() {
    const studies = (await getDocs(collection(db, "studies"))).docs.map(
      (doc) => doc.data() as Study
    );

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
      value={{ isLoaded, allStudies, installedStudyIds }}
    >
      {props.children}
    </StudiesContext.Provider>
  );
}

function logStudyInstalled(
  studyId: string,
  attribution: Record<string, string>
) {
  const { analytics } = useFirebase();

  const eventParams: Record<string, string> = { studyId };

  ["source", "medium", "campaign", "term", "content"].forEach((code) => {
    if (code in attribution) {
      eventParams[code] = attribution[code];
    }
  });

  logEvent(analytics, "activate_extension", eventParams);
}
