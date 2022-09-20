import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import FirebaseConfig from "../../../firebase.config.json";
import { useFirebase } from "../FirebaseService";

jest.mock("@firebase/app");
jest.mock("firebase/analytics");
jest.mock("firebase/auth");
jest.mock("firebase/firestore");

describe("FirebaseService tests", () => {
  it("initializes correctly", () => {
    const app = { app: "test" };
    const auth = { auth: "test" };
    const db = { db: "test" };
    const analytics = { analytics: "abc123" };
    const functionsHost = FirebaseConfig.functionsHost;

    (initializeApp as jest.Mock).mockReturnValue(app);
    (getAnalytics as jest.Mock).mockReturnValue(analytics);
    (getAuth as jest.Mock).mockReturnValue(auth);
    (getFirestore as jest.Mock).mockReturnValue(db);

    expect(useFirebase()).toEqual({ app, auth, db, analytics, functionsHost });

    expect(initializeApp).toHaveBeenCalledWith(FirebaseConfig);

    // Ensure initialization only happens once
    (initializeApp as jest.Mock).mockImplementation(() => {
      throw new Error("Duplicate initialization.");
    });

    expect(useFirebase()).toEqual({ app, auth, db, analytics, functionsHost });

    expect(getAnalytics).toHaveBeenCalledWith(app);
  });
});
