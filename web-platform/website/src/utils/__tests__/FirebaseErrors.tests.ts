import { FirebaseError } from "firebase/util";

import { Strings } from "../../resources/Strings";
import { getFirebaseErrorMessage } from "../FirebaseErrors";

const firebaseErrors: { [key: string]: string } =
  Strings.utils.firebaseError.errorMessages;

describe("FirebaseErrors tests", () => {
  it("Generates correct error for all recognized errors", () => {
    expect(getFirebaseErrorMessage({ code: "unknown" } as FirebaseError)).toBe(
      firebaseErrors.unknown
    );

    for (let k in firebaseErrors) {
      expect(getFirebaseErrorMessage({ code: k } as FirebaseError)).toBe(
        firebaseErrors[k]
      );
    }
  });
});
