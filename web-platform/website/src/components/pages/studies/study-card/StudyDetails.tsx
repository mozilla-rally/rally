import { StudyDescription } from "./StudyDescription";
import { StudyTopDetails } from "./StudyTopDetails";

export function StudyDetails() {
  return (
    <div className="p-4">
      <StudyTopDetails />
      <StudyDescription />
    </div>
  );
}
