import { FirebaseApp, initializeApp } from "@firebase/app";
import assert from "assert";
import { Analytics, getAnalytics } from "firebase/analytics";
import { Auth, connectAuthEmulator, getAuth } from "firebase/auth";
import {
  Firestore,
  connectFirestoreEmulator,
  getFirestore,
} from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";

import FirebaseConfig from "../../firebase.config.json";

export interface FirebaseDataContext {
  app: FirebaseApp;
  analytics: Analytics;
  auth: Auth;
  db: Firestore;
  functionsHost: string;
}

let context: FirebaseDataContext | null = null;

export function useFirebase() {
  if (!context) {
    const isEmulatorMode = !!process.env.NEXT_PUBLIC_EMULATOR_MODE;

    const app = initializeApp(FirebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    const functionsHost = FirebaseConfig.functionsHost;

    assert(functionsHost, "Invalid functions host");

    if (isEmulatorMode) {
      connectAuthEmulator(auth, "http://localhost:9099");
      connectFunctionsEmulator(getFunctions(app), "localhost", 5001);
      connectFirestoreEmulator(db, "localhost", 8080);
    }

    context = {
      app,
      analytics:
        typeof window !== "undefined" ? getAnalytics(app) : ({} as Analytics),
      auth,
      db,
      functionsHost,
    };
  }

  return context;
}
