import { act, render } from "@testing-library/react";
import { logEvent } from "firebase/analytics";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";

import {
  AuthenticationProvider,
  UserType,
  getCurrentUser,
  useAuthentication,
} from "../AuthenticationService";
import { useFirebase } from "../FirebaseService";
import {
  deleteEmailUser as deleteEmailUserFn,
  deleteGoogleUser as deleteGoogleUserFn,
  loginWithEmail as loginWithEmailFn,
  loginWithGoogle as loginWithGoogleFn,
  logout,
  signupWithEmail as signupWithEmailFn,
} from "../UserAccountService";

const firebaseResult = {
  auth: {
    uid: "uid",
  },
  analytics: "analytics",
};

jest.mock("firebase/analytics");
jest.mock("firebase/auth");
jest.mock("../FirebaseService", () => ({
  useFirebase: jest.fn().mockReturnValue(firebaseResult),
}));
jest.mock("../UserAccountService");

describe("AuthenticationService tests", () => {
  it("zero state", () => {
    let renderCount = 0;

    function Component() {
      const {
        user,
        isLoaded,
        isLoggingIn,
        getIsUserVerified,
        userType,
        deleteGoogleUser,
      } = useAuthentication();

      expect(user).toBeUndefined();

      if (renderCount === 0) {
        expect(isLoaded).toBeFalsy();
      } else {
        expect(isLoaded).toBeTruthy();
      }

      expect(isLoggingIn).toBeFalsy();
      getIsUserVerified().then((isUserVerified) => {
        expect(isUserVerified).toBeFalsy();
      });
      expect(userType).toBeNull();

      deleteGoogleUser();

      expect(deleteGoogleUserFn).toHaveBeenCalledWith(undefined);

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

    expect((onAuthStateChanged as jest.Mock).mock.calls[0][0]).toBe(
      firebaseResult.auth
    );
  });

  it("handles unverified email user", () => {
    (useFirebase as jest.Mock).mockReturnValue(firebaseResult);

    let isAuthenticated = false;

    const unverifiedUser = {
      firebaseUser: {
        uid: "uid",
        providerData: [
          {
            providerId: "password",
          },
        ],
        emailVerified: false,
      },
    };

    function Component() {
      const { user, getIsUserVerified, userType } = useAuthentication();

      if (!isAuthenticated) {
        expect(user).toBeUndefined();
      } else {
        expect(user).toEqual(unverifiedUser);
        expect(userType).toBe(UserType.Email);
      }

      getIsUserVerified().then((isUserVerified) => {
        expect(isUserVerified).toBeFalsy();
      });

      return null;
    }

    render(
      <AuthenticationProvider>
        <Component />
      </AuthenticationProvider>
    );

    expect(onAuthStateChanged).toHaveBeenCalled();

    expect((onAuthStateChanged as jest.Mock).mock.calls[0][0]).toBe(
      firebaseResult.auth
    );

    // Invoke onAuthStateChanged callback
    isAuthenticated = true;
    act(() => {
      (onAuthStateChanged as jest.Mock).mock.calls[0][1](
        unverifiedUser.firebaseUser
      );
    });

    expect(logEvent).toHaveBeenCalledWith("analytics", "sign_in");
  });

  it("handles verified email user", async () => {
    (useFirebase as jest.Mock).mockReturnValue(firebaseResult);

    let isAuthenticated = false;

    const verifiedUser = {
      uid: "uid",
      providerData: [
        {
          providerId: "google.com",
        },
      ],
      emailVerified: true,
    };

    function Component() {
      const { user, getIsUserVerified, userType } = useAuthentication();

      if (!isAuthenticated) {
        expect(user).toBeUndefined();
        getIsUserVerified().then((isUserVerified) => {
          expect(isUserVerified).toBeFalsy();
        });
      } else {
        expect(user).toEqual({ firebaseUser: verifiedUser });
        expect(userType).toBe(UserType.Google);

        getIsUserVerified().then((isUserVerified) => {
          expect(isUserVerified).toBeTruthy();
        });
      }

      return null;
    }

    render(
      <AuthenticationProvider>
        <Component />
      </AuthenticationProvider>
    );

    expect(onAuthStateChanged).toHaveBeenCalled();

    expect((onAuthStateChanged as jest.Mock).mock.calls[0][0]).toBe(
      firebaseResult.auth
    );

    // Invoke onAuthStateChanged callback
    isAuthenticated = true;
    act(() => {
      (onAuthStateChanged as jest.Mock).mock.calls[0][1](verifiedUser);
    });

    expect(logEvent).toHaveBeenCalledWith("analytics", "sign_in");
  });

  it("google user is verified", () => {
    (useFirebase as jest.Mock).mockReturnValue(firebaseResult);

    let isAuthenticated = false;

    const googleUser = {
      uid: "uid",
      providerData: [
        {
          providerId: "google.com",
        },
      ],
    };

    function Component() {
      const { user, getIsUserVerified } = useAuthentication();

      if (!isAuthenticated) {
        expect(user).toBeUndefined();
        getIsUserVerified().then((isUserVerified) => {
          expect(isUserVerified).toBeFalsy();
        });
      } else {
        expect(user).toEqual({ firebaseUser: googleUser });

        getIsUserVerified().then((isUserVerified) => {
          expect(isUserVerified).toBeTruthy();
        });
      }

      return null;
    }

    render(
      <AuthenticationProvider>
        <Component />
      </AuthenticationProvider>
    );

    expect(onAuthStateChanged).toHaveBeenCalled();

    expect((onAuthStateChanged as jest.Mock).mock.calls[0][0]).toBe(
      firebaseResult.auth
    );

    // Invoke onAuthStateChanged callback
    isAuthenticated = true;
    act(() => {
      (onAuthStateChanged as jest.Mock).mock.calls[0][1](googleUser);
    });
    expect(logEvent).toHaveBeenCalledWith("analytics", "sign_in");
  });

  it("logout logs the user out", () => {
    (useFirebase as jest.Mock).mockReturnValue(firebaseResult);

    let isAuthenticated = false;

    const googleUser = {
      uid: "uid",
      providerData: [
        {
          providerId: "google.com",
        },
      ],
    };

    function Component() {
      const { user, getIsUserVerified, logout } = useAuthentication();

      if (!isAuthenticated) {
        expect(user).toBeUndefined();
        getIsUserVerified().then((isUserVerified) => {
          expect(isUserVerified).toBeFalsy();
        });
      } else {
        expect(user).toEqual({ firebaseUser: googleUser });

        getIsUserVerified().then((isUserVerified) => {
          expect(isUserVerified).toBeTruthy();
        });

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

    expect((onAuthStateChanged as jest.Mock).mock.calls[0][0]).toBe(
      firebaseResult.auth
    );

    // Invoke onAuthStateChanged callback
    isAuthenticated = true;

    act(() => {
      (onAuthStateChanged as jest.Mock).mock.calls[0][1](googleUser);
    });

    expect(logout).toHaveBeenCalled();

    // Invoke onAuthStateChanged callback
    isAuthenticated = false;

    act(() => {
      (onAuthStateChanged as jest.Mock).mock.calls[0][1](undefined);
    });

    expect(logEvent).toHaveBeenCalledWith("analytics", "sign_out");
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

    (useFirebase as jest.Mock).mockReturnValue(firebaseResult);

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

    (useFirebase as jest.Mock).mockReturnValue(firebaseResult);

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

    (useFirebase as jest.Mock).mockReturnValue(firebaseResult);

    render(
      <AuthenticationProvider>
        <Component />
      </AuthenticationProvider>
    );

    expect(loginWithGoogleFn).toHaveBeenCalled();

    expect(useFirebase).toHaveBeenCalled();
  });

  it("deleteEmailUser correctly calls the firebase function", async () => {
    (useFirebase as jest.Mock).mockReturnValue(firebaseResult);

    const verifiedUser = {
      uid: "uid",
      providerData: [
        {
          providerId: "google.com",
        },
      ],
      emailVerified: true,
    };

    const password = "abc123";

    function Component() {
      const { user, deleteEmailUser } = useAuthentication();

      useEffect(() => {
        (async () => {
          await deleteEmailUser(password);
        })();
      }, [user]);

      return null;
    }

    render(
      <AuthenticationProvider>
        <Component />
      </AuthenticationProvider>
    );

    expect(onAuthStateChanged).toHaveBeenCalled();

    expect((onAuthStateChanged as jest.Mock).mock.calls[0][0]).toBe(
      firebaseResult.auth
    );

    expect(deleteEmailUserFn).toHaveBeenCalledWith(undefined, password);

    // Invoke onAuthStateChanged callback
    await act(async () => {
      (onAuthStateChanged as jest.Mock).mock.calls[0][1](verifiedUser);
    });

    expect(deleteEmailUserFn).toHaveBeenCalledWith(verifiedUser, password);
    expect(logEvent).toHaveBeenCalledWith("analytics", "sign_in");
  });

  it("deleteGoogleUser correctly calls the firebase function", async () => {
    (useFirebase as jest.Mock).mockReturnValue(firebaseResult);

    const verifiedUser = {
      uid: "uid",
      providerData: [
        {
          providerId: "google.com",
        },
      ],
      emailVerified: true,
    };

    function Component() {
      const { user, deleteGoogleUser } = useAuthentication();

      useEffect(() => {
        (async () => {
          await deleteGoogleUser();
        })();
      }, [user]);

      return null;
    }

    render(
      <AuthenticationProvider>
        <Component />
      </AuthenticationProvider>
    );

    expect(onAuthStateChanged).toHaveBeenCalled();

    expect((onAuthStateChanged as jest.Mock).mock.calls[0][0]).toBe(
      firebaseResult.auth
    );

    expect(deleteGoogleUserFn).toHaveBeenCalledWith(undefined);

    // Invoke onAuthStateChanged callback
    await act(async () => {
      (onAuthStateChanged as jest.Mock).mock.calls[0][1](verifiedUser);
    });

    expect(deleteGoogleUserFn).toHaveBeenCalledWith(verifiedUser);
    expect(logEvent).toHaveBeenCalledWith("analytics", "sign_in");
  });

  it("getCurrentUser correctly returns the user", async () => {
    (useFirebase as jest.Mock).mockReturnValue(firebaseResult);

    const userPromise = getCurrentUser();

    expect(onAuthStateChanged).toHaveBeenCalled();

    expect((onAuthStateChanged as jest.Mock).mock.calls[0][0]).toBe(
      firebaseResult.auth
    );

    const user = {
      id: "1234",
    };

    (onAuthStateChanged as jest.Mock).mock.calls[0][1](user);

    await expect(userPromise).resolves.toBe(user);
  });
});
