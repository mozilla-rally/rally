import { FirebaseApp, initializeApp } from "@firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

import FirebaseConfig from "../../firebase.config.json";

export interface FirebaseDataContext {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
}

let context: FirebaseDataContext | null = null;

export function useFirebase() {
  if (!context) {
    const app = initializeApp(FirebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    context = { app, auth, db };
  }

  return context;
}
