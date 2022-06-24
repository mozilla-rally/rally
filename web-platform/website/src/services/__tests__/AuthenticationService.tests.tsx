import { act, render } from "@testing-library/react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect } from "react";

import {
  AuthenticationProvider,
  useAuthentication,
} from "../AuthenticationService";
import { useFirebase } from "../FirebaseService";
import { signupWithEmail as signupWithEmailFunction } from "../UserAccountService";

jest.mock("firebase/auth");
jest.mock("../FirebaseService");
jest.mock("../UserAccountService");

describe("AuthenticationService tests", () => {
  it("zero state", () => {
    const auth = { auth: "test" };
    (useFirebase as jest.Mock).mockReturnValue(auth);

    let renderCount = 0;

    function Component() {
      const { user, isLoaded, isLoggingIn, isUserVerified } =
        useAuthentication();

      expect(user).toBeUndefined();

      if (renderCount === 0) {
        expect(isLoaded).toBeFalsy();
      } else {
        expect(isLoaded).toBeTruthy();
      }

      expect(isLoggingIn).toBeFalsy();
      expect(isUserVerified).toBeFalsy();

      renderCount++;

      return null;
    }

    render(
      <AuthenticationProvider>
        <Component />
      </AuthenticationProvider>
    );

    expect(renderCount).toBe(2);

    expect(onAuthStateChanged).toHaveBeenCalled();

    expect((onAuthStateChanged as jest.Mock).mock.calls[0][0]).toBe(auth.auth);
  });

  it("handles unverified email user", () => {
    const auth = { auth: "test" };
    (useFirebase as jest.Mock).mockReturnValue(auth);

    let isAuthenticated = false;

    const unverifiedUser = {
      firebaseUser: {
        providerData: [
          {
            providerId: "password",
          },
        ],
        emailVerified: false,
      },
    };

    function Component() {
      const { user, isUserVerified } = useAuthentication();

      if (!isAuthenticated) {
        expect(user).toBeUndefined();
      } else {
        expect(user).toEqual({ firebaseUser: unverifiedUser });
      }

      expect(isUserVerified).toBeFalsy();

      return null;
    }

    render(
      <AuthenticationProvider>
        <Component />
      </AuthenticationProvider>
    );

    expect(onAuthStateChanged).toHaveBeenCalled();

    expect((onAuthStateChanged as jest.Mock).mock.calls[0][0]).toBe(auth.auth);

    // Invoke onAuthStateChanged callback
    isAuthenticated = true;
    act(() => {
      (onAuthStateChanged as jest.Mock).mock.calls[0][1](unverifiedUser);
    });
  });

  it("handles verified email user", () => {
    const auth = { auth: "test" };
    (useFirebase as jest.Mock).mockReturnValue(auth);

    let isAuthenticated = false;
    let isVerified = false;

    const verifiedUser = {
      providerData: [
        {
          providerId: "password",
        },
      ],
      emailVerified: true,
    };

    function Component() {
      const { user, isUserVerified } = useAuthentication();

      if (!isAuthenticated) {
        expect(user).toBeUndefined();
        expect(isUserVerified).toBeFalsy();
      } else {
        expect(user).toEqual({ firebaseUser: verifiedUser });

        // Because user and isUserVerified are updated in different batches
        // we cannot test isUserVerified here.
        isVerified = isUserVerified;
      }

      return null;
    }

    render(
      <AuthenticationProvider>
        <Component />
      </AuthenticationProvider>
    );

    expect(onAuthStateChanged).toHaveBeenCalled();

    expect((onAuthStateChanged as jest.Mock).mock.calls[0][0]).toBe(auth.auth);

    // Invoke onAuthStateChanged callback
    isAuthenticated = true;
    act(() => {
      (onAuthStateChanged as jest.Mock).mock.calls[0][1](verifiedUser);
    });

    expect(isVerified).toBeTruthy();
  });

  it("google user is verified", () => {
    const auth = { auth: "test" };
    (useFirebase as jest.Mock).mockReturnValue(auth);

    let isAuthenticated = false;
    let isVerified = false;

    const googleUser = {
      providerData: [
        {
          providerId: "google",
        },
      ],
    };

    function Component() {
      const { user, isUserVerified } = useAuthentication();

      if (!isAuthenticated) {
        expect(user).toBeUndefined();
        expect(isUserVerified).toBeFalsy();
      } else {
        expect(user).toEqual({ firebaseUser: googleUser });

        // Because user and isUserVerified are updated in different batches
        // we cannot test isUserVerified here.
        isVerified = isUserVerified;
      }

      return null;
    }

    render(
      <AuthenticationProvider>
        <Component />
      </AuthenticationProvider>
    );

    expect(onAuthStateChanged).toHaveBeenCalled();

    expect((onAuthStateChanged as jest.Mock).mock.calls[0][0]).toBe(auth.auth);

    // Invoke onAuthStateChanged callback
    isAuthenticated = true;
    act(() => {
      (onAuthStateChanged as jest.Mock).mock.calls[0][1](googleUser);
    });

    expect(isVerified).toBeTruthy();
  });

  it("logout logs the user out", () => {
    const auth = { auth: "test" };
    (useFirebase as jest.Mock).mockReturnValue(auth);

    let isAuthenticated = false;
    let isVerified = false;

    const googleUser = {
      providerData: [
        {
          providerId: "google",
        },
      ],
    };

    function Component() {
      const { user, isUserVerified, logout } = useAuthentication();

      if (!isAuthenticated) {
        expect(user).toBeUndefined();
        expect(isUserVerified).toBeFalsy();
      } else {
        expect(user).toEqual({ firebaseUser: googleUser });

        // Because user and isUserVerified are updated in different batches
        // we cannot test isUserVerified here.
        isVerified = isUserVerified;

        logout();
      }

      return null;
    }

    render(
      <AuthenticationProvider>
        <Component />
      </AuthenticationProvider>
    );

    expect(onAuthStateChanged).toHaveBeenCalled();

    expect((onAuthStateChanged as jest.Mock).mock.calls[0][0]).toBe(auth.auth);

    // Invoke onAuthStateChanged callback
    isAuthenticated = true;

    act(() => {
      (onAuthStateChanged as jest.Mock).mock.calls[0][1](googleUser);
    });

    expect(isVerified).toBeTruthy();

    expect(signOut).toHaveBeenCalledWith(auth.auth);
  });

  it("signupWithEmail calls firebase correctly", () => {
    function Component() {
      const { signupWithEmail } = useAuthentication();

      useEffect(() => {
        (async () => {
          signupWithEmail("email", "password");
        })();
      }, []);

      return null;
    }

    const auth = { auth: "test" };
    (useFirebase as jest.Mock).mockReturnValue(auth);

    render(
      <AuthenticationProvider>
        <Component />
      </AuthenticationProvider>
    );

    expect(signupWithEmailFunction).toHaveBeenCalledWith("email", "password");
  });
});
