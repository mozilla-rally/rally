export const Strings = {
  components: {
    navigationBar: {
      a11y: {
        logo: "Rally Logo",
        menuButton: "Menu Button",
      },
      dataAndPrivacy: {
        text: "Data & Privacy",
        link: "https://rally.mozilla.org/how-rally-works/data-and-privacy/",
      },
      rallyWebsiteUrl: "https://rally.mozilla.org/",
      sections: [
        {
          heading: "Your Rally account",
          links: [
            {
              text: "Manage Profile",
              href: "/profile",
            },
            {
              text: "Studies",
              href: "/studies",
            },
            {
              text: "Account Settings",
              href: "/account-settings",
            },
            {
              text: "Sign Out",
              href: "",
              command: "logout",
              external: false,
            },
          ],
        },
        {
          heading: "Get Help",
          links: [
            {
              text: "Support",
              href: "https://support.mozilla.org/en-US/kb/about-mozilla-rally",
              external: true,
              command: undefined,
            },
            {
              text: "FAQ",
              href: "",
            },
          ],
        },
      ],
      topLinks: [
        {
          title: "Current Studies",
          href: "/studies",
          external: false,
        },
        {
          title: (
            <>
              Support
              <img src="/img/open-external.svg" className="ms-1 mb-1" />
            </>
          ),
          href: "https://support.mozilla.org/en-US/kb/about-mozilla-rally",
          external: true,
        },
      ],
    },
    pages: {
      login: {
        emailAccountCreatedView: {
          backToSignIn: "Back to Sign In",
          message:
            "To finish creating your account with Rally, please check your email inbox and verify your email address.",
          needHelp: (
            <>
              Need additional help?{" "}
              <a href="https://members.rally.mozilla.org/" className="fw-bold">
                Contact us
              </a>
            </>
          ),
          title: "Check Your Mail",
        },
        emailSignupView: {
          continue: "Continue",
          email: "Email",
          password: "Password",
          title: "Create Account",
        },
        loginFormValidators: {
          invalidFormat: "Invalid format",
          required: "Required",
          passwordRules: {
            minLength: "Use at least 8 characters",
            containsLowercase: "Use at least 1 lowercase letter",
            containsUppercase: "Use at least 1 uppercase letter",
            containsDigit: "Use at least 1 number",
          },
        },
        loginPageContainer: {
          title: "Sign Up | Mozilla Rally",
        },
        loginView: {
          createAccount: "Create account",
          dontHaveAnAccount: "Don't have an account?",
          email: "Email",
          forgotPassword: "Forgot Password",
          or: "or",
          password: "Password",
          signIn: "Sign in",
          signInWithGoogle: "Sign up with Google",
          title: "Welcome Back",
        },
        initialLoginView: {
          signInWithEmail: "Sign up with Email",
          signInWithGoogle: "Sign up with Google",
          title: "Join Rally",
        },
        privacyNoticeAndLoginLink: {
          accountExists: (
            <span className="text-muted">Already have an account?</span>
          ),
          privacyNotice: (
            <span className="text-muted">
              By joining, you agree to our{" "}
              <a href="https://rally.mozilla.org/how-rally-works/data-and-privacy/">
                privacy notice.
              </a>
            </span>
          ),
          signIn: "Sign in",
        },
        resetPasswordView: {
          preEmailSent: {
            backTo: "Back to",
            email: "Email",
            message:
              "Enter your email and we'll send you a link to reset your password.",
            resetPassword: "Reset Password",
            signIn: "sign in",
            title: "Forgot Password?",
          },
          postEmailSent: {
            backToSignIn: "Back to Sign In",
            messageFormat:
              "Instructions to reset your password have been sent to {email}",
            needHelp: (
              <>
                Need additional help?{" "}
                <a
                  href="https://members.rally.mozilla.org/"
                  className="fw-bold"
                >
                  Contact us
                </a>
              </>
            ),
            title: "Check Your Email",
          },
        },
      },
    },
  },
  pages: {
    index: {
      title: "Studies | Mozilla Rally",
    },
  },
  utils: {
    firebaseError: {
      errorMessages: {
        "auth/email-already-in-use": "Account already exists. Please sign in.",
        "auth/invalid-email": "Invalid email.",
        "auth/network-request-failed": "Network connectivity failed.",
        "auth/wrong-password": "Incorrect password.",
        "auth/user-not-found": "User not found.",
        unknown: "An unknown error has occurred. Please try again.",
      },
    },
  },
};
