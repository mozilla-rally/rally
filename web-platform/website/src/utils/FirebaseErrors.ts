import { FirebaseError } from "@firebase/util";

import { Strings } from "../resources/Strings";

export enum FirebaseErrorCode {
  EmailAlreadyInUse = "auth/email-already-in-use",
  InvalidEmail = "auth/invalid-email",
  NetworkFailure = "auth/network-request-failed",
  WrongPassword = "auth/wrong-password",
  UserNotFound = "auth/user-not-found",
  Unknown = "unknown",
}

export function getFirebaseErrorMessage(err: FirebaseError): string {
  const errorCode =
    (!err && FirebaseErrorCode.Unknown) ||
    (err.code === FirebaseErrorCode.EmailAlreadyInUse &&
      FirebaseErrorCode.EmailAlreadyInUse) ||
    (err.code === FirebaseErrorCode.InvalidEmail &&
      FirebaseErrorCode.InvalidEmail) ||
    (err.code === FirebaseErrorCode.NetworkFailure &&
      FirebaseErrorCode.NetworkFailure) ||
    (err.code === FirebaseErrorCode.WrongPassword &&
      FirebaseErrorCode.WrongPassword) ||
    (err.code === FirebaseErrorCode.UserNotFound &&
      FirebaseErrorCode.UserNotFound) ||
    FirebaseErrorCode.Unknown;

  return Strings.utils.firebaseError.errorMessages[errorCode];
}
