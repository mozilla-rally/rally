import { act, render } from "@testing-library/react";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";

import {
  AuthenticationProvider,
  UserType,
  useAuthentication,
} from "../AuthenticationService";
import { useFirebase } from "../FirebaseService";
import {
  loginWithEmail as loginWithEmailFn,
  loginWithGoogle as loginWithGoogleFn,
  logout,
  signupWithEmail as signupWithEmailFn,
} from "../UserAccountService";

const auth = { auth: "test" };

jest.mock("firebase/auth");
jest.mock("../FirebaseService", () => ({
  useFirebase: jest.fn().mockReturnValue(auth),
}));
jest.mock("../UserAccountService");

describe("AuthenticationService tests", () => {
  it("zero state", () => {
    let renderCount = 0;

    function Component() {
      const { user, isLoaded, isLoggingIn, isUserVerified, userType } =
        useAuthentication();

      expect(user).toBeUndefined();

      if (renderCount === 0) {
        expect(isLoaded).toBeFalsy();
      } else {
        expect(isLoaded).toBeTruthy();
      }

      expect(isLoggingIn).toBeFalsy();
      expect(isUserVerified).toBeFalsy();
      expect(userType).toBeNull();

      renderCount++;

      return null;
    }

    render(
      <AuthenticationProvider>
        <Component />
      </AuthenticationProvider>
    );

    expect(renderCount).toBe(1);

    expect(onAuthStateChanged).toHaveBeenCalled();

    expect((onAuthStateChanged as jest.Mock).mock.calls[0][0]).toBe(auth.auth);
  });

  it("handles unverified email user", () => {
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
      const { user, isUserVerified, userType } = useAuthentication();

      if (!isAuthenticated) {
        expect(user).toBeUndefined();
      } else {
        expect(user).toEqual({ firebaseUser: unverifiedUser });
        expect(userType).toBe(UserType.Email);
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
    (useFirebase as jest.Mock).mockReturnValue(auth);

    let isAuthenticated = false;
    let isVerified = false;

    const verifiedUser = {
      providerData: [
        {
          providerId: "google.com",
        },
      ],
      emailVerified: true,
    };

    function Component() {
      const { user, isUserVerified, userType } = useAuthentication();

      if (!isAuthenticated) {
        expect(user).toBeUndefined();
        expect(isUserVerified).toBeFalsy();
      } else {
        expect(user).toEqual({ firebaseUser: verifiedUser });
        expect(userType).toBe(UserType.Google);

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
    (useFirebase as jest.Mock).mockReturnValue(auth);

    let isAuthenticated = false;
    let isVerified = false;

    const googleUser = {
      providerData: [
        {
          providerId: "google.com",
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
    (useFirebase as jest.Mock).mockReturnValue(auth);

    let isAuthenticated = false;
    let isVerified = false;

    const googleUser = {
      providerData: [
        {
          providerId: "google.com",
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

    expect(logout).toHaveBeenCalled();
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

    (useFirebase as jest.Mock).mockReturnValue(auth);

    render(
      <AuthenticationProvider>
        <Component />
      </AuthenticationProvider>
    );

    expect(signupWithEmailFn).toHaveBeenCalledWith("email", "password");

    expect(useFirebase).toHaveBeenCalled();
  });

  it("loginWithEmail calls firebase correctly", () => {
    function Component() {
      const { loginWithEmail } = useAuthentication();

      useEffect(() => {
        (async () => {
          loginWithEmail("email", "password");
        })();
      }, []);

      return null;
    }

    (useFirebase as jest.Mock).mockReturnValue(auth);

    render(
      <AuthenticationProvider>
        <Component />
      </AuthenticationProvider>
    );

    expect(loginWithEmailFn).toHaveBeenCalledWith("email", "password");

    expect(useFirebase).toHaveBeenCalled();
  });

  it("loginWithGoogle calls firebase correctly", () => {
    function Component() {
      const { loginWithGoogle } = useAuthentication();

      useEffect(() => {
        (async () => {
          loginWithGoogle();
        })();
      }, []);

      return null;
    }

    (useFirebase as jest.Mock).mockReturnValue(auth);

    render(
      <AuthenticationProvider>
        <Component />
      </AuthenticationProvider>
    );

    expect(loginWithGoogleFn).toHaveBeenCalled();

    expect(useFirebase).toHaveBeenCalled();
  });
});
