export const Strings = {
  components: {
    footer: {
      bottomLinks: [
        {
          text: "Rally Privacy Policy",
          link: "https://rally.mozilla.org/how-rally-works/data-and-privacy/",
          external: true,
        },
        {
          text: "Mozilla Privacy Policy",
          link: "https://www.mozilla.org/en-US/privacy/websites/",
          external: true,
        },
        {
          text: "Legal",
          link: "https://www.mozilla.org/en-US/about/legal/",
          external: true,
        },
      ],
      copyright: "© Mozilla 2022. We’re Building a Better Internet",
      sections: [
        {
          heading: {
            text: "How Rally Works",
            link: "https://rally.mozilla.org/how-rally-works/",
            external: true,
          },
          links: [
            {
              text: "Data & Privacy",
              link: "/terms",
              external: false,
            },
            {
              text: "FAQs",
              link: "https://rally.mozilla.org/how-rally-works/faqs/",
              external: true,
            },
          ],
        },
        {
          heading: {
            text: "Current Studies",
            link: "https://rally.mozilla.org/current-studies",
            external: true,
          },
          links: [
            {
              text: "Attention Stream",
              link: "https://rally.mozilla.org/current-studies/attention-stream/",
              external: true,
            },
            {
              text: "Beyond the Paywall",
              link: "https://rally.mozilla.org/current-studies/beyond-the-paywall/",
              external: true,
            },
            {
              text: "Political and Covid-19 News",
              link: "https://rally.mozilla.org/current-studies/political-and-covid-19-news-v3/",
              external: true,
            },
            {
              text: "Search Engine Usage and Result Quality",
              link: "https://rally.mozilla.org/current-studies/search-engine-usage/",
              external: true,
            },
          ],
        },
        {
          heading: {
            text: "Past Studies",
            link: "https://rally.mozilla.org/past-studies/",
            external: true,
          },
          links: [
            {
              text: "Facebook Pixel Hunt",
              link: "https://rally.mozilla.org/past-studies/facebook-pixel-hunt/",
              external: true,
            },
            {
              text: "Political and Covid-19 News",
              link: "https://rally.mozilla.org/current-studies/political-and-covid-19-news-v3/",
              external: true,
            },
            {
              text: `Your Time Online and "Doomscrolling"`,
              link: "https://rally.mozilla.org/past-studies/your-time-online-and-doomscrolling/",
              external: true,
            },
          ],
        },
        {
          heading: {
            text: "About Rally",
            link: "https://rally.mozilla.org/about-rally/",
            external: true,
          },
          links: [
            {
              text: "Subscribe to our newsletter",
              link: "https://rally.mozilla.org/newsletter/index.html",
              external: true,
            },
          ],
        },
        {
          heading: {
            text: "Careers",
            link: "https://rally.mozilla.org/careers/",
            external: true,
          },
          links: [],
        },
        {
          heading: {
            text: "Support",
            link: "https://support.mozilla.org/en-US/kb/about-mozilla-rally",
            external: true,
          },
          links: [
            {
              text: "Contact us",
              link: "mailto:contact@rally.mozilla.org",
              external: true,
            },
          ],
        },
      ],
      twitterLink: "https://twitter.com/mozillarally",
    },
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
              href: "/",
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
          href: "/",
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
      accountSettings: {
        accountSettings: {
          tagline:
            "Manage your info, privacy, and security to make Rally work better for you.",
          title: "Account Settings",
        },
        editAccountSettings: {
          edit: "Edit",
          title: "Sign in",
          email: "Email",
          password: "Password",
        },
        editEmailAccount: {
          cancel: "Cancel",
          forgot: "Forgot password?",
          newEmail: "New email address",
          password: "Password",
          title: "Change your email address",
          update: "Update email",
        },
        editPasswordAccount: {
          cancel: "Cancel",
          confirm: "Confirm new password",
          current: "Current password",
          forgot: "Forgot password?",
          new: "New password",
          title: "Change your password",
          update: "Update password",
        },
        emailChanged: {
          title: "Check your email",
          message:
            "Successfully sent email change request. To finish updating, please sign out and follow instructions sent to {email}.",
        },
        deleteAccount: {
          cancel: "Cancel",
          deleteAccount: "Delete your Rally Account",
          deleteLandingPageUrl:
            "https://rally.mozilla.org/account-deleted/index.html",
          text: (
            <>
              <p className="text-body">
                <b>Deleting your Rally account means:</b>
              </p>
              <ul>
                <li>
                  <b>Rally will stop collecting all data.</b>
                </li>
                <li>
                  <b>You will stop contributing browsing data to studies</b> you
                  may have joined.
                </li>
                <li>
                  <b>Rally will delete all your profile information.</b>
                </li>
                <li>
                  <b>Rally will delete all your data from open studies</b> you
                  had joined. Researchers may still have access to browsing data
                  you contributed to <b>completed studies.</b>
                </li>
              </ul>
            </>
          ),
          title: "Delete your Rally Account",
        },
        deleteAccountConfirmation: {
          cancel: "Cancel",
          deleteAccount: "Delete your Rally account",
          emailText: "Enter your password below to confirm.",
          googleText: (
            <>
              <p>This will permanently delete your account.</p>
              <p>
                <b>Note:</b> You may be asked to authenticate with Google to
                complete the process.
              </p>
            </>
          ),
          password: "Password",
          title: "Are you sure?",
        },
        deleteAccountDisclaimer: {
          delete: "Delete",
          tagline:
            "This account will no longer be available, and all your saved data will be permanently deleted.",
          title: "Delete Account",
        },
        googleAccountSettings: {
          changeSettings:
            "You can change your Security or Privacy settings through your Google Account",
          connectedWithGoogle: "Connected with Google",
          connectedTimestampFormat: "Connected to {email} on {date}",
          email: "Email",
          googleAccountLink: "https://www.google.com/account",
          manageAccount: "Manage Account",
          title: "Sign In",
        },
        navigationBar: {
          sections: [
            {
              text: "Manage Profile",
              icon: "/img/icon-profile.svg",
              link: "/profile",
              external: false,
            },
            {
              text: "Account Settings",
              icon: "/img/icon-gear.svg",
              command: "AccountSettings",
              links: [
                {
                  accountType: "email",
                  text: "Edit Email",
                  command: "EditEmail",
                },
                {
                  accountType: "email",
                  text: "Edit Password",
                  command: "EditPassword",
                },
                {
                  text: "Delete Account",
                  command: "DeleteAccount",
                },
              ],
            },
          ],
        },
      },
      login: {
        emailSignupView: {
          continue: "Continue",
          creatingAccount: "Creating account...",
          email: "Email",
          emailSubscription:
            "Send me occasional updates and communications from Rally",
          password: "Password",
          title: "Create Account",
        },
        getExtensionView: {
          getExt: "Add the extension",
          skip: "Skip for now",
          subTitle:
            "Congrats on joining the Rally community! To start contributing, let's add the extension.",
          title: "Lastly, add the extension",

          bulletTitle: "The extension empowers you to:",
          bullets: [
            "Enable Mozilla Rally's trusted researchers to expose Big Tech's hidden privacy violations and help hold them accountable.",
          ],
          valueProp: {
            title: "With contributions like yours: ",
            valueProps: [
              {
                valueText:
                  "class actions lawsuits were filed regarding Facebook and Meta",
                valueIcon: "5",
              },
              {
                valueText:
                  "patients of Novant Health were sent data breach notifications",
                valueIcon: "1.3m",
              },
            ],
          },
        },
        launchCardText: {
          headline: "Use your data to build a better internet",
          bullets: [
            "Monitor big tech platforms",
            "Improve user privacy and control",
            "Leave at any time. We'll delete your data",
          ],
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
        loginPageContentV2: {
          titles: {
            accountFirst: {
              subtitle:
                "To safely contribute and manage your data on Rally, you’ll first need to create an account.",
              title: (
                <>
                  <div>Let's Rally. Create</div>
                  <div style={{ textAlign: "initial" }}>your account</div>
                </>
              ),
            },
            extensionFirst: {
              subtitle:
                "Congrats on downloading the extension! Before you can contribute, we need to create an account so you can manage your data.",
              title: (
                <>
                  <div>Now, let's create</div>
                  <div style={{ textAlign: "initial" }}>your account</div>
                </>
              ),
            },
          },
          valuePropositions: {
            default: {
              tagline: "Join 10,000+ users on Rally",
            },
          },
        },
        loginView: {
          createAccount: "Create account",
          dontHaveAnAccount: "Don't have an account?",
          email: "Email",
          forgotPassword: "Forgot Password",
          or: "or",
          password: "Password",
          signIn: "Sign in",
          signInWithGoogle: "Sign in with Google",
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
          initial: {
            acceptAndEnroll: "Accept & Enroll",
            decline: "Decline",
          },

          v2: {
            agree: "Agree",
            back: "Back",
          },
        },

        modalHeader: "Our privacy policy and your data consent",

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
                    data cookies, pixels, ads, and other information set by
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
                <>
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
                </>
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
                alt: "Our Research Partners and Customers.",
              },
              text: (
                <>
                  <b>Our Research Partners and Customers</b>
                  <p>
                    Rally partners with trusted third parties to build and
                    release studies. When you join a study, we may ask you to
                    share the data we’ve collected under{" "}
                    <b>this Privacy Notice</b> with the third party
                    researcher(s) administering the study and/or other Mozilla
                    research customers who we may share your data with. Our
                    research partners and customers are under contracts with
                    Mozilla to ensure that <b>your data is protected</b> and
                    handled only in the ways we've approved.
                  </p>
                  <p>
                    Research customers may compensate Mozilla for secure access
                    to data collected in ongoing studies. We will always
                    disclose when this is the case.
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

      profile: {
        age: {
          options: [
            {
              title: "19-24 years old",
              value: "19_24",
            },
            {
              title: "25-34 years old",
              value: "25_34",
            },
            {
              title: "35-44 years old",
              value: "35_44",
            },
            {
              title: "45-54 years old",
              value: "45_54",
            },
            {
              title: "55-64 years old",
              value: "55_64",
            },
            {
              title: "65 years and older",
              value: "over_65",
            },
          ],
          title: "1. What is your age?",
        },
        buttons: {
          saveChanges: "Save Changes",
          cancel: "Skip",
        },
        ethnicity: {
          options: [
            {
              title: "American Indian or Alaska Native",
              value: "american_indian_or_alaska_native",
            },
            {
              title: "Asian Indian",
              value: "asian_indian",
            },
            {
              title: "Black or African American",
              value: "black_or_african_american",
            },
            {
              title: "Chamorro",
              value: "chamorro",
            },
            {
              title: "Chinese",
              value: "chinese",
            },
            {
              title: "Filipino",
              value: "filipino",
            },
            {
              title: "Japanese",
              value: "japanese",
            },
            {
              title: "Korean",
              value: "korean",
            },
            {
              title: "Native Hawaiian",
              value: "native_hawaiian",
            },
            {
              title: "Samoan",
              value: "samoan",
            },
            {
              title: "Vietnamese",
              value: "vietnamese",
            },
            {
              title: "White",
              value: "white",
            },
            {
              title: "Other Asian",
              value: "other_asian",
            },
            {
              title: "Other Pacific Islander",
              value: "other_pacific_islander",
            },
            {
              title: "Some other race",
              value: "some_other_race",
            },
          ],
          title: "4. What is your race / ethnicity",
        },
        gender: {
          options: [
            {
              title: "Male",
              value: "male",
            },
            {
              title: "Female",
              value: "female",
            },
            {
              title: "Neither choice describes me",
              value: "neither",
            },
            {
              title: "Decline to identify",
              value: "decline",
            },
          ],
          title: "2. What is your gender?",
        },
        hispanic: {
          options: [
            {
              title: "No, not of Hispanic, Latinx, or Spanish origin",
              value: "other",
            },
            {
              title: "Yes",
              value: "hispanicLatinxSpanish",
            },
          ],
          title: "3. Are you of Hispanic, Latinx, or Spanish origin?",
        },
        income: {
          tagline: "Please provide an approximate estimate in US Dollars:",
          title:
            "6. What is your household's combined annual income during the past 12 months?",
        },
        school: {
          options: [
            { title: "Less than high school", value: "less_than_high_school" },
            { title: "Some high school", value: "some_high_school" },
            {
              title: "High school graduate or equivalent (for example GED)",
              value: "high_school_graduate_or_equivalent",
            },
            {
              title: "Some college, but degree not received or in progress",
              value: "some_college_but_no_degree_or_in_progress",
            },
            {
              title: "Associate's degree (for example AA, AS)",
              value: "associates_degree",
            },
            {
              title: "Bachelor's degree (for example BA, BS, BB)",
              value: "bachelors_degree",
            },
            {
              title:
                "Graduate degree (for example master's, professional, doctorate)",
              value: "graduate_degree",
            },
          ],
          title: "5. What is the highest level of school you have completed?",
        },
        standardProfileSection: {
          clearResponse: "Clear this response",
        },
        title: {
          tagline:
            "Each question is completely optional, and can be updated at any time by clicking Manage Profile. The answers you give will help us understand the composition and representivity of the Rally community. Additionally, collaborators will combine your answers with the data collected in the studies you join to enrich their findings and answer research questions.",
          title: "Tell Us About Yourself",
        },
        zipCode: {
          invalidZipCode: "Zip code must be a five-digit number.",
          title: "7. What is your zip code?",
        },
      },
      studies: {
        alerts: {
          verifyEmail: {
            type: "verify-email",
            text: "Please check your email and verify your account.",
            button: "Resend",
            icon: "/img/warning.svg",
            close: "/img/close.svg",
            modal: {
              title: "Check your email",
              img: "/img/illustration-email.png",
              close: "/img/close.svg",
              text: "To finish creating your account with Rally, please check your meail inbox and verify your email address",
              help: "Need help?",
              link: {
                text: "Contact us",
                address: "mailto:contact@rally.mozilla.org",
                external: true,
              },
            },
          },
          privacyPolicy: {
            type: "privacy-policy",
            text: "Please agree to our privacy policy. Required to start contributing.",
            button: "Review privacy policy",
            icon: "/img/critical.svg",
          },

          addExtension: {
            type: "add-extension",
            text: "Please add the extension. Required to start contributing.",
            button: "Add extension",
            icon: "/img/critical.svg",
          },
        },
        studyCard: {
          description: {
            aboutThisStudy: "About this study",
            keyDataCollected: "Key Data Collected",
            viewFullStudyDetails: "View Full Study Details",
          },
          addStudy: {
            addExtension: "Add Study Extension",
            cancel: "Cancel",
            enrollText: (
              <>
                <h1>Rally Study Consent Notice</h1>
                <p>
                  Data will be collected through a custom browser web extension
                  developed by the Rally team. We will install the web extension
                  and data will be collected through browser data after you
                  opt-in. Mozilla will store the data on Google Cloud where all
                  analysis will be conducted. This server is restricted to the
                  study researchers and is encrypted. Data will be transferred
                  by TLS between the participant's browser and the Mozilla
                  analysis database. TLS stands for "transport layer security"
                  which encrypts browser data.
                </p>
                <h2>Leaving the Study</h2>
                <p>
                  You can leave the study at any time from the Mozilla Rally
                  options page. To access the page, click on the Rally button
                  rally icon{" "}
                  <img
                    src="/favicon.svg"
                    height="16"
                    width="16"
                    alt="rally icon"
                    style={{ margin: "0px 4px" }}
                  />{" "}
                  in your browser toolbar. The button is usually near the top
                  right of the browser window. If you have removed the Rally
                  button from your toolbar, you can also access the Rally
                  options page from the browser’s Add-ons settings. The Rally
                  options page will show you a list of studies that you are
                  currently enrolled in. You can leave this study by clicking
                  the “Leave Study” button on the associated study card. If you
                  leave the study, the study’s browser extension will be
                  automatically uninstalled, removing the study code and data
                  from your browser. We will also automatically delete the data
                  that your browser has submitted for the study, unless you
                  allow us to retain that data. You may not be able to rejoin
                  the study if you leave. If you leave Rally, you will also
                  leave the studies that you are enrolled in, including this
                  study.
                </p>
              </>
            ),
          },
          dontJoinStudy: {
            addStudyExtension: "Add study extension",
            dontJoinStudy: "Don't join this study",
            tagline:
              "You previously started to join this study, but didn’t finish the process by installing the study extension from the Chrome Web Store.",
            title: "Confirm if you want to join this study or not",
          },
          leaveStudy: {
            cancel: "Cancel",
            leaveStudy: "Leave Study",
            tagline: "You’re free to come and go as you please.",
            text: (
              <>
                <p>
                  <b>Leaving a study means:</b>
                </p>
                <ul>
                  <li>
                    <b>You will only be leaving this specific study</b>. You
                    will continue contributing your browsing data to any other
                    studies you've joined.
                  </li>
                  <li>
                    <b>
                      You will stop contributing browsing data to this study
                    </b>{" "}
                    and the researchers leading this study.
                  </li>
                  <li>
                    <b>Rally will delete all your data from this study.</b>
                  </li>
                </ul>
              </>
            ),
            title: "Leave this Study?",
          },
          header: {
            addExtension: {
              chrome: "Add study extension from the Chrome Web Store.",
              firefox: "Add study extension from the Firefox Store.",
            },
            participating: "You're participating.",
            notParticipatingYet: "You're not participating yet. ",
            menus: {
              addExtension: "Add study extension",
              dontJoinStudy: "Don't join this study",
              leaveStudy: "Leave study",
            },
          },
          title: {
            ends: "Ends: {expiry}",
            taglineFormat: "{publisher} | {expiry}",
          },
          topDetails: {
            joinStudy: "Join Study",
          },
        },
        title: {
          tagline:
            "Browse available studies and find the choice (or choices) that feel right to you.",
          title: "Current Studies",
        },
        tooltip: {
          sections: [
            {
              title: "Read the study card",
              text: {
                chrome:
                  "The card discloses the data we collect from you, who has access to the data, and how it will be used.",
                firefox:
                  "The card discloses the data we collect from you, who has access to the data, and how it will be used.",
              },
            },
            {
              title: "Join the Study",
              text: {
                chrome: (
                  <>
                    Click the <b>Join Study</b> button. We'll ask you to confirm
                    in a pop-up dialog by clicking the{" "}
                    <b>Add Study Extension</b> button. This will open up the
                    Chrome Web Store.
                  </>
                ),
                firefox: (
                  <>
                    Click the <b>Join Study</b> button. We'll ask you to confirm
                    in a pop-up dialog by clicking the{" "}
                    <b>Add Study Extension</b> button. This will open up the
                    Firefox Adds-ons Store.
                  </>
                ),
              },
            },
            {
              title: "Add study extension",
              text: {
                chrome: (
                  <>
                    In the Chrome Web Store, click on the <b>Add to Chrome</b>{" "}
                    button. This will add the study's extension to your browser.
                    You are now participating!
                  </>
                ),
                firefox: (
                  <>
                    In the Firefox Adds-ons Store, click on the{" "}
                    <b>Add to Firefox</b> button. This will add the study's
                    extension to your browser. You are now participating!
                  </>
                ),
              },
            },
          ],
          title: "How to join a study",
        },
      },
    },
  },
  pages: {
    accountSettings: {
      title: "Account Settings | Mozilla Rally",
    },
    getExtension: {
      title: "Get Extension | Mozilla Rally",
    },
    index: {
      title: "Studies | Mozilla Rally",
    },
    login: {
      title: "Sign Up | Mozilla Rally",
    },
    privacyPolicy: {
      title: "Privacy Policy | Mozilla Rally",
    },
    profile: {
      title: "Tell Us About Yourself | Mozilla Rally",
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
    passwordErrorMessages: {
      mismatched: "Passwords do not match",
      invalidRules: "Invalid rules",
      passwordError: "Password error",
    },
    emailErrorMessages: {
      newEmail: "Please enter a new email",
    },
    toastMessages: {
      passwordUpdated: "Successfully changed password",
    },
  },
};
