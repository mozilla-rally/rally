import type { Timestamp } from "firebase/firestore";

import type { UserDemographicsData } from "./UserDemographicsData";
import type { UserStudyRecord } from "./UserStudyRecord";

export interface UserDocument {
  uid: string;
  enrolled: boolean;
  onboared: boolean;
  createdOn: Timestamp;
  demographicsData: UserDemographicsData;
  studies: Record<string, UserStudyRecord>;
  subscribedToEmail: boolean;
  attribution: Record<string, string>;
}
