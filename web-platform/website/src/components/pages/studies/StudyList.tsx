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
      {allStudies.map((s) => (
        <StudyProvider study={s} key={s.studyId}>
          <StudyCard />
        </StudyProvider>
      ))}
    </div>
  );
}
