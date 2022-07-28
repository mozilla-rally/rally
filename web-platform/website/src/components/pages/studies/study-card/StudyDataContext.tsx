import { Study } from "@mozilla/rally-shared-types";
import { createContext, useContext, useState } from "react";

import { useStudies } from "../../../../services/StudiesService";
import { useUserDocument } from "../../../../services/UserDocumentService";

export interface StudyDataContext {
  study: Study;
  isInstalledLocally: boolean;
  isUserEnrolled: boolean;
  isStudyEnrollmentInProgress: boolean;
  startStudyEnrollmentToggle(): void;
  endStudyEnrollmentToggle(): void;
}

const StudyContext = createContext<StudyDataContext>(
  {} as unknown as StudyDataContext
);

export function useStudy() {
  return useContext(StudyContext);
}

export function StudyProvider(props: {
  children: React.ReactNode;
  study: Study;
}) {
  const [study] = useState(props.study);
  const { installedStudyIds } = useStudies();
  const { userDocument } = useUserDocument();
  const [isStudyEnrollmentInProgress, setIsStudyEnrollmentInProgress] =
    useState(false);

  const studyId = study.studyId;

  return (
    <StudyContext.Provider
      value={{
        study: props.study,
        isInstalledLocally: installedStudyIds.includes(studyId),
        isUserEnrolled: Boolean(
          userDocument &&
            userDocument.studies &&
            userDocument.studies[studyId] &&
            userDocument.studies[studyId].enrolled
        ),
        isStudyEnrollmentInProgress,
        startStudyEnrollmentToggle: () => setIsStudyEnrollmentInProgress(true),
        endStudyEnrollmentToggle: () => setIsStudyEnrollmentInProgress(false),
      }}
    >
      {props.children}
    </StudyContext.Provider>
  );
}
