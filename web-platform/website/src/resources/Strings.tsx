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
              text: "Home",
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
          title: "Home",
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
        manageContributions: {
          tagline: "Manage your contributions",
          title: "Your Data Contributions",
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
              text: "Manage Your Contributions",
              icon: "/favicon.svg",
              command: "ManageContributions",
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
      home: {
        alerts: {
          closeIcon: "/img/close-white.svg",
          verifyEmail: {
            type: "verify-email",
            text: "Please check your email and verify your account.",
            button: "Resend",
            icon: "/img/warning.svg",
            modal: {
              title: "Check your email",
              img: "/img/your-contact-data.png",
              close: "/img/close.svg",
              text: "To finish creating your account with Rally, please check your email inbox and verify your email address",
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
            icon: "/img/error.svg",
          },

          addExtension: {
            type: "add-extension",
            text: "Please add the extension. Required to start contributing.",
            button: "Add extension",
            icon: "/img/error.svg",
          },
        },
        pervasivePixels: {
          title: "Pervasive Pixels",
          subtitle:
            "The network graph represents the top 1000 domains by attention",
          text: "A tracking pixel is a tiny bit of code in the background of a website that allows the installer to gather information about visitors to a website. It's important to note that not all tracking pixels are created equal. Some trackers collect browsing data, including sites you visit and ads you click, but others capture much more personal and sensitive information. Through our research study with The Markup, the “Facebook Pixel Hunt”, we were able to identify the top 1,000 sites visited by the Rally community and reveal which sites are tracking more than just those bunny slippers you've had in your cart for the last month.",
          datawrapperSource: "https://datawrapper.dwcdn.net/UtaYJ/1/",
        },
        statsBox: {
          content: [
            {
              number: "8",
              text: "research projects",
            },
            {
              number: "185,984,07",
              text: "discovered data pings",
            },
            {
              number: "6,294,163",
              text: "total tracking pixels found",
            },
          ],
        },
        news: {
          headline: {
            content: (
              <>
                <p>
                  Issues of bodily autonomy in gender reproduction are becoming
                  more and more fraught, with anti-trans legislation and the
                  overturn of Roe v Wade. Medicine , traditional and startups
                  are using the internet to provide care, including medication.
                  One startup , Hey Jane has risen as a way to provide safe
                  medication options for reproductive care. Unfortunately with
                  the rise of telehealth, comes new ways for data surveillance..
                  W Most of the time, no one knows exactly what is being sent,
                  including the platforms receiving the data. As part of the
                  Markup’s work with PIxel Hunt, Hey Jane was found to be
                  sending data to Meta, Google and others. As soon as they were
                  made aware , they turned them off.
                </p>

                <p>
                  The best part of Rally’s work is not fighting the platforms
                  but providing safety and consent to users. Giving critical
                  care providers and patients the ability to make informed
                  choices not just about their medical health, but their data
                  health as well.
                </p>
              </>
            ),
            link: {
              text: "Meta Pixel Hunt",
            },
            tagline: "ISSUES",
            title: "Health and Bodily Autonomy",
          },
          items: [
            {
              imageUrl: " ",
            },
            {
              date: "07.01.2022",
              content: (
                <>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                  tempor vestibulum vestibulum. Phasellus vulputate nec erat
                  eget sagittis. Cras hendrerit vitae felis convallis mollis.
                  Proin auctor leo ut ullamcorper sodales. Nam semper ut tellus
                  posuere accumsan. Donec ut condimentum nulla
                </>
              ),
              source: "The Markup",
              title:
                "Online Abortion Pill Provider Hey Jane Used Tracking Tools That Sent Visitor Data to Meta, Google, and Others",
              type: "News",
              url: "",
            },
            {
              date: "07.01.2022",
              content: (
                <>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                  tempor vestibulum vestibulum. Phasellus vulputate nec erat
                  eget sagittis. Cras hendrerit vitae felis convallis mollis.
                  Proin auctor leo ut ullamcorper sodales. Nam semper ut tellus
                  posuere accumsan. Donec ut condimentum nulla
                </>
              ),
              source: "The Markup",
              title:
                "Facebook Is Receiving Sensitive Medical Information from Hospital Websites",
              type: "News",
              url: "",
            },
            {
              date: "07.01.2022",
              content: (
                <>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                  tempor vestibulum vestibulum. Phasellus vulputate nec erat
                  eget sagittis. Cras hendrerit vitae felis convallis mollis.
                  Proin auctor leo ut ullamcorper sodales. Nam semper ut tellus
                  posuere accumsan. Donec ut condimentum nulla
                </>
              ),
              source: "The Markup",
              title:
                "Lawsuit claims Facebook wrongly collects patient data through health system",
              type: "News",
              url: "",
            },
          ],
        },
        surveyCard: {
          closeIcon: "/img/close.svg",
          image: "/img/home-illo-1.png",
          title: "Tell us about yourself",
          profile: "/profile",
          text: (
            <>
              <p>
                Take five minutes to fill out seven questions to help our
                partners understand how big tech targets us.
              </p>
              <p>
                You can update, add, or rescind your answers under Manage
                Profile. This info helps us better understand the representivity
                of our study participants.
              </p>
            </>
          ),
          button: "Create profile",
        },
        studyCard: {
          description: {
            aboutThisStudy: "About your contribution",
            keyDataCollected: "Data collected",
            viewFullStudyDetails: "View full study details",
          },
          header: {
            participating: "You're contributing",
            notParticipatingYet: "You're not contributing yet",
            menus: {
              leaveStudy: "Stop contributing",
            },
          },
          title: {
            ends: "Ends: {expiry}",
            taglineFormat: "{expiry}",
          },
          topDetails: {
            reactivateStudy: "Reactivate",
          },
        },
        title: {
          title: "Welcome to Rally",
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
          ],
          tagline: `When you click “Accept and Enroll” below, you are consenting to data collection, which could include:`,
          title: "The Types of Information We Collect",
        },
        howDataIsUsed: {
          sections: [
            {
              text: (
                <>
                  <p>
                    Your data contributions provide Rally and our research
                    partners a cross-website view of the internet. These
                    contributions shed light on how information spreads, where
                    people spend their time, and how tech platforms interact and
                    recommend content to the Rally community.
                  </p>
                </>
              ),
            },
            {
              text: (
                <>
                  <p>
                    The results will help Rally and our research partners
                    understand users’ experiences, build better products, and
                    gather evidence on how the web is working for users. We will
                    publicly share research findings and any discoveries that
                    could enable more privacy and control in consumer products.
                  </p>
                </>
              ),
            },
            {
              text: (
                <>
                  <p>
                    We will always inform you of which research partners have
                    access to Rally data and whenever new partners join. Some
                    research partners compensate Rally for access to our
                    infrastructure and data. We will always disclose if research
                    partners compensate Mozilla for access to Rally data.
                  </p>
                </>
              ),
            },
          ],
          title: "How Rally Uses Data",
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
                  <b>This notice only covers Rally.</b>We also adhere to the{" "}
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
                    you can choose to disclose the level of information you’re
                    comfortable with, either by finding a study that matches
                    your level of comfort or by declining to share demographic
                    information in your profile.{" "}
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
        readyToRally: {
          sections: [],
          tagline:
            "The internet should be used to benefit all, not just some. With your help, we can create a safer, more transparent, and more equitable internet that protects people, not Big Tech.",
          title: "Ready to Rally?",
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
            {
              image: {
                url: "/img/people-like-you.png",
                width: 84,
                alt: "Our Research Partners and Customers.",
              },
              text: (
                <>
                  <p>
                    Our mission is focused on{" "}
                    <b>empowering everyday citizens</b>, not just a select few.
                    To that end, we may release aggregated, de-identified data
                    sets to help further public knowledge of certain issues.
                    These data sets will be{" "}
                    <b>stripped of any identifiable data</b>, and won’t reveal
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
            "Before you get started, please make sure you‘re comfortable with our privacy notice.",
          title: "Privacy Notice",
        },
        yourContributions: {
          sections: [
            {
              text: (
                <>
                  <p>Time you spend engaging with web pages</p>
                  <ul>
                    <li>Visits to web page URLs</li>
                    <li>Time spent on urls</li>
                    <li>Time spent playing media on each webpage</li>
                  </ul>
                  <p>The content of some pages sent to your browser</p>
                  <ul>
                    <li>
                      On certain news pages, the full text of the article and
                      the ads on the article’s page
                    </li>
                    <li>
                      On certain media platforms, metadata about the content you
                      view and algorithmic content recommendations you receive
                    </li>
                    <li>
                      The content and metadata of ads you are shown across the
                      web
                    </li>
                    <li>
                      The data sent through various tracking pixels from the
                      websites you visit
                    </li>
                  </ul>
                </>
              ),
            },
          ],
          title: "Your Rally Data Contributions",
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
      title: "Home | Mozilla Rally",
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
