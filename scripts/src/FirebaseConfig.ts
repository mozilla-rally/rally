import * as admin from "firebase-admin";

export function initializeFirebase() {
  admin.initializeApp({ credential: admin.credential.applicationDefault() });
}
