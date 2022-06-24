import { signupWithEmail } from "../UserAccountService";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useFirebase } from "../FirebaseService";

jest.mock("firebase/auth");
jest.mock("../FirebaseService");

describe("UserAccountService tests", () => {
  it("signupWithEmail correctly creates user account", async () => {
    const auth = { auth: "test" };

    (useFirebase as jest.Mock).mockReturnValue({ auth });

    const userCredential = { user: "test user" };

    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue(userCredential);

    await expect(signupWithEmail("email", "password")).resolves.toBe(userCredential);

    expect(sendEmailVerification).toHaveBeenCalledWith(userCredential.user);
  });
});