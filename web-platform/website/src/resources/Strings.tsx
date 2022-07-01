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
      privacyPolicy: {
        buttons: {
          acceptAndEnroll: "Accept & Enroll",
          decline: "Decline",
        },
        dataCollectionTypes: {
          sections: [
            {
              image: {
                url: "/img/your-demographic-data.png",
                width: 84,
                alt: "Your Demographic Data.",
              },
              text: (
                <>
                  <b>Your Demographic Data</b>
                  <p>
                    This includes your{" "}
                    <b>
                      age, gender, race/ethnicity, education level, household
                      income,
                    </b>{" "}
                    and <b>zip code</b>. This is entirely optional. We collect
                    this information so researchers can understand how Rally
                    users compare to the general population.
                  </p>
                </>
              ),
            },
            {
              image: {
                url: "/img/your-technical-data.png",
                width: 84,
                alt: "Your Device's Technical Data.",
              },
              text: (
                <>
                  <b>Your Device's Technical Data</b>
                  <p>
                    This includes your device's <b>operating system</b> and{" "}
                    <b>IP address</b> (which we'll only hang on to temporarily).
                  </p>
                </>
              ),
            },
            {
              image: {
                url: "/img/your-interaction-data.png",
                width: 84,
                alt: "Your interaction data.",
              },
              text: (
                <>
                  <b>Your Interaction Data</b>
                  <p>
                    This includes your <b>interactions with</b> the Rally
                    website and with <b>your web browser</b>. Interaction data
                    includes the number and type of browser extensions you have
                    installed, your interactions with the Rally add-on itself,
                    and the duration of your active browsing session. We collect
                    this data to understand usage, prioritize new features, and
                    confirm all Rally systems are working properly.
                  </p>
                </>
              ),
            },
            {
              image: {
                url: "/img/your-contact-data.png",
                width: 84,
                alt: "Your Contact Data.",
              },
              text: (
                <>
                  <b>Your Contact Data</b>
                  <p>
                    This includes your <b>email address</b>, which we use to
                    authenticate and help you administer your login account. We
                    also use your email address to send you notifications on the
                    studies you have joined.
                  </p>
                </>
              ),
            },
            {
              image: {
                url: "/img/your-location-data.png",
                width: 84,
                alt: "Your Location Data.",
              },
              text: (
                <>
                  <b>Your Location Data</b>
                  <p>
                    This includes your <b>country, city</b>, and <b>state</b>{" "}
                    location, which is determined by your <b>IP address.</b>
                  </p>
                </>
              ),
            },
            {
              text: (
                <>
                  <b>Study-Specific Data</b>
                  <p>
                    Studies may collect additional data, depending on the
                    purpose of the study. Each study description will disclose
                    the particular data collected for that study. This data may
                    include the websites you visit, your search engine results,
                    and data cookies, pixels and other information set by
                    particular websites.
                  </p>
                </>
              ),
            },
          ],
          tagline: `When you click “Accept and Enroll” below, you are consenting to data collection, which could include:`,
          title: "The Types of Information We Collect",
        },
        informationUse: {
          sections: [
            {
              image: {
                url: "/img/how-we-use-your-information.png",
                width: 84,
                alt: "How We Use Your Information.",
              },
              text: (
                <p>
                  <ul>
                    <li className="mb-2">
                      Determining which Rally participants could be eligible to
                      participate in particular research studies, should they
                      choose to enroll.
                    </li>
                    <li className="mb-2">
                      Ensuring that the data we collect represents the diverse
                      communities that use the internet.
                    </li>
                    <li className="mb-2">
                      Improving Mozilla's existing products and services
                    </li>
                    <li>Creating and developing new products.</li>
                  </ul>
                </p>
              ),
            },
          ],
          tagline:
            "We use the information we collect for research and development, which could mean:",
          title: "How We Use Your Information",
        },
        introduction: {
          sections: [
            {
              image: {
                url: "/img/new-platform.png",
                width: 84,
                alt: "Mozilla Rally is a new platform created to empower people to contribute their data towards building a better internet",
              },
              text: (
                <p>
                  Mozilla Rally is a <b>new platform</b> created to empower
                  people to contribute their data towards{" "}
                  <b>building a better internet.</b>
                </p>
              ),
            },
            {
              image: {
                url: "/img/who-is-eligible.png",
                width: 84,
                alt: "It is currently available to Firefox and Chrome users in the U.S. who are 19 or older.",
              },
              text: (
                <p>
                  It is currently available to Firefox and Chrome users in the
                  U.S. who are 19 or older.
                </p>
              ),
            },
            {
              image: {
                url: "/img/notice-covers-rally.png",
                width: 84,
                alt: "It is currently available to Firefox and Chrome users in the U.S. who are 19 or older.",
              },
              text: (
                <p>
                  <b>This notice only covers Rally itself</b>, as each study
                  will have a unique privacy notice detailing how data is
                  collected and handled in that particular study. We also adhere
                  to the{" "}
                  <a href="https://www.mozilla.org/en-US/privacy/">
                    Mozilla Privacy Policy
                  </a>{" "}
                  for how we receive, handle, and share information.
                </p>
              ),
            },
          ],
          tagline:
            "In this notice, we detail what data Mozilla Rally collects and discloses, and why it does so.",
          title: "Introduction",
        },
        manageData: {
          sections: [
            {
              image: {
                url: "/img/manage-your-data.png",
                width: 84,
                alt: "How You Can Manage Your Data.",
              },
              text: (
                <>
                  <p>
                    Rally operates based on <b>your participation</b> – meaning
                    you can choose to disclose the level of information you're
                    comfortable with, either by finding a study that matches
                    your level of comfort or by declining to share demographic
                    information in your profile.
                  </p>
                  <p className="mb-4">
                    <a
                      href="https://support.mozilla.org/en-US/kb/mozilla-rally-managing-account-data"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Learn more about managing your data.
                    </a>
                  </p>
                  <p>
                    If you have any other questions regarding our privacy
                    practices, please contact us at{" "}
                    <a href="mailto:compliance@mozilla.com">
                      compliance@mozilla.com
                    </a>
                    .
                  </p>
                </>
              ),
            },
          ],
          tagline: `Our "opt-in" approach to data collection means that you choose which data you share with us.`,
          title: "How You Can Manage Your Data",
        },
        sharing: {
          sections: [
            {
              image: {
                url: "/img/data-storage-provider.png",
                width: 84,
                alt: "Our Data Storage Provider.",
              },
              text: (
                <>
                  <b>Our Data Storage Provider</b>
                  <p>
                    We use Google's cloud storage service to store the data
                    collected through Rally. Google only stores Rally data and
                    <b> cannot use that data for its own purposes.</b>
                  </p>
                </>
              ),
            },
            {
              image: {
                url: "/img/our-research-collaborators.png",
                width: 84,
                alt: "Our Research Collaborators.",
              },
              text: (
                <>
                  <b>Our Research Collaborators</b>
                  <p>
                    Rally collaborates with trusted third parties to build and
                    release studies. For any studies you join, we may ask you to
                    share the data collected under <b>this Privacy Notice</b>{" "}
                    with third party researcher(s) administering the study. Our
                    research collaborators are under contracts with Mozilla to
                    ensure that <b>your data is protected</b> and handled only
                    in ways we've approved.
                  </p>
                </>
              ),
            },

            {
              image: {
                url: "/img/people-like-you.png",
                width: 84,
                alt: "People Like You (only aggregated data).",
              },
              text: (
                <>
                  <b>People Like You (only aggregated data)</b>
                  <p>
                    Our mission is focused on{" "}
                    <b>empowering everyday citizens</b>, not just a select few.
                    To that end, we may release aggregated, de-identified data
                    sets to help further public knowledge on certain issues.
                    These data sets will be{" "}
                    <b>stripped of any identifiable data</b>, and won't reveal
                    anything about individual users.
                  </p>
                </>
              ),
            },
          ],
          tagline:
            "We may share information with trusted entities that help us fulfill our mission, including:",
          title: "Who We May Share Information With",
        },
        title: {
          tagline:
            "Before you get started, please make sure you're comfortable with our privacy notice.",
          title: "Our Privacy Notice",
        },
      },
    },
  },
  pages: {
    index: {
      title: "Studies | Mozilla Rally",
    },
    privacyPolicy: {
      title: "Privacy Policy | Mozilla Rally",
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
