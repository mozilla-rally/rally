import { Study } from "@mozilla/rally-shared-types";
import { HTMLAttributes } from "react";

import { useStudies } from "../../../services/StudiesService";
import { StudyCard } from "./study-card/StudyCard";
import { StudyProvider } from "./study-card/StudyDataContext";

export function StudyList({
  children, // eslint-disable-line @typescript-eslint/no-unused-vars
  ...rest
}: HTMLAttributes<HTMLDivElement>): JSX.Element | null {
  const { isLoaded, allStudies } = useStudies();

  if (!isLoaded) {
    return null;
  }

  return (
    <div {...rest}>
      {allStudies.map(
        (s) =>
          isStudyValid(s) && (
            <StudyProvider study={s} key={s.studyId}>
              <StudyCard />
            </StudyProvider>
          )
      )}
    </div>
  );
}

function isStudyValid(study: Study) {
  const UA = window.navigator.userAgent;

  const browserCompat =
    (UA.includes("Firefox") &&
      study.downloadLink &&
      study.downloadLink.firefox) ||
    (UA.includes("Chrome") && study.downloadLink && study.downloadLink.chrome);

  return study && !study.studyEnded && !study.studyPaused && browserCompat;
}
