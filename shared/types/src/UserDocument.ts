import type { Timestamp } from "firebase/firestore";

import type { UserStudyRecord } from "./UserStudyRecord";

export interface UserDocument {
  uid: string;
  enrolled: boolean;
  onboared: boolean;
  createdOn: Timestamp;
  demographicsData: Record<string, string>;
  studies: Record<string, UserStudyRecord>;
}
