import type { Timestamp } from "firebase/firestore";

export interface UserStudyRecord {
  studyId: string;
  joinedOn: Timestamp;
  attached: boolean;
  enrolled: boolean;
}
