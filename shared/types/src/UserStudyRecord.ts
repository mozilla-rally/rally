import type { Timestamp } from "firebase/firestore";

export interface UserStudyRecord {
  studyId: string;
  version: string;
  joinedOn: Timestamp;
  attached: boolean;
  enrolled: boolean;
}
