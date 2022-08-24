import { initializeApp } from "@firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { useFirebase } from "../FirebaseService";

import FirebaseConfig from "../../../firebase.config.json";

jest.mock("@firebase/app");
jest.mock("firebase/auth");
jest.mock("firebase/firestore");

describe("FirebaseService tests", () => {
  it("initializes correctly", () => {
    const app = { app: "test" };
    const auth = { auth: "test" };
    const db = { db: "test" };

    (initializeApp as jest.Mock).mockReturnValue(app);
    (getAuth as jest.Mock).mockReturnValue(auth);
    (getFirestore as jest.Mock).mockReturnValue(db);

    expect(useFirebase()).toEqual({ app, auth, db });

    expect(initializeApp).toHaveBeenCalledWith(FirebaseConfig);

    // Ensure initialization only happens once
    (initializeApp as jest.Mock).mockImplementation(() => { throw new Error("Duplicate initialization."); });

    expect(useFirebase()).toEqual({ app, auth, db });
  });
});