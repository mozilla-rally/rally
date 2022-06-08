import type { Writable } from "svelte/store";

export interface AppStore extends Omit<Writable<State>, "update"> {
  loginWithGoogle: Function;
  signupWithEmailAndPassword: Function;
  loginWithEmailAndPassword: Function;
  signOutUser: Function;
  sendUserPasswordResetEmail: Function;
  resetUserPassword: Function;
  resendUserVerificationEmail: Function;
  changeEmail: Function;
  isUserVerified: Function;
  getUserEmail: Function;
  getUserProvider: Function,
  deleteUserAccount: Function;
  updateOnboardedStatus: Function;
  updateStudyEnrollment: Function;
  updatePlatformEnrollment: Function;
  updateDemographicSurvey: Function;
}

export interface State {
  userStudies: UserStudies;
  _initialized: boolean;
  user?: User;
  studies?: Array<StudyMetadata>;
}

export interface User {
  uid: string;
  createdOn: { seconds: number; nanoseconds: number; };
  enrolled: boolean;
  onboarded: boolean;
  demographicsData: object;
  providerData: object
}

export interface UserStudies {
  [key: string]: UserStudy;
}

export interface UserStudy {
  joinedOn: { seconds: number; nanoseconds: number; };
  enrolled: boolean;
  studyId: string;
}

export interface StudyMetadata {
  name: string;
  description: string;
  studyId?: string;
  tags: string[];
  icons: Record<string, string>;
  addonId?: string;
  authors: {
    name: string;
    url?: string;
  };
  endDate: string;
  version: string;
  studyEnded: boolean;
  studyPaused: boolean;
  downloadLink: string;
  schemaNamespace?: string;
  studyDetailsLink: string;
  minimumCoreVersion?: string;
  dataCollectionDetails: string[];
}