import type { Timestamp } from "firebase/firestore";

export interface UserStudyRecord {
  studyId: string;
  version: string;
  joinedOn: Timestamp;
  enrolled: boolean;
}
