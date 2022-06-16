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
        loginPageContainer: {
          howDoesItWork: "Wait - how does it work again?",
          title: "Sign Up | Mozilla Rally",
        },
        initialLoginView: {
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
          signInWithEmail: "Sign up with Email",
          signInWithGoogle: "Sign up with Google",
          title: "Join Rally",
        },
      },
    },
  },
  pages: {
    index: {
      title: "Studies | Mozilla Rally",
    },
  },
};
