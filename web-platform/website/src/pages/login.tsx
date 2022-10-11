import { UserDocument } from "@mozilla/rally-shared-types";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { style } from "typestyle";

import { Layout } from "../components/Layout";
import { LoginPageContent } from "../components/pages/login/LoginPageContent";
import { LoginPageContentV2 } from "../components/pages/login/LoginPageContentV2";
import { Flags } from "../resources/Flags";
import { Strings } from "../resources/Strings";
import { useAuthentication } from "../services/AuthenticationService";
import { useFlagService } from "../services/FlagService";
import { useStudies } from "../services/StudiesService";
import { useUserDocument } from "../services/UserDocumentService";
import {
  ApplyFullscapePageStyles,
  ScreenSize,
  createResponsiveStyle,
} from "../styles";

const strings = Strings.pages.login;

const LoginPage: NextPage = () => {
  const { isLoaded, user } = useAuthentication();
  const router = useRouter();
  const { isFlagActive } = useFlagService();
  const { installedStudyIds } = useStudies();

  const { updateUserDocument } = useUserDocument();

  if (!isLoaded || !router.isReady) {
    return null;
  }

  async function saveEmailSubscriptionBeforeRedirecting(url: string) {
    if (window.sessionStorage.getItem("subscribedToEmail") === "true") {
      window.sessionStorage.removeItem("subscribedToEmail");
      try {
        await updateUserDocument({ subscribedToEmail: true } as UserDocument);
      } catch (e) {} // eslint-disable-line no-empty
    }

    router.replace(url);
  }

  if (user) {
    const redirectUrl =
      isFlagActive(Flags.onboardingV2) && !installedStudyIds.length
        ? "/get-extension"
        : "/";
    saveEmailSubscriptionBeforeRedirecting(redirectUrl);
    return null;
  }

  if (isFlagActive(Flags.onboardingV2)) {
    return (
      <LoginPageContentV2>
        <Head>
          <title>{strings.title}</title>
        </Head>
      </LoginPageContentV2>
    );
  }

  return (
    <Layout>
      <>
        <Head>
          <title>{strings.title}</title>
        </Head>
        <div className={styles.signBackground}>
          <LoginPageContent />
        </div>
      </>
    </Layout>
  );
};

ApplyFullscapePageStyles();

const styles = {
  signBackground: style(
    {
      backgroundImage: "none",
    },
    createResponsiveStyle(
      ScreenSize.Medium,
      {
        width: "100%",
        height: "100vh",
        background: "no-repeat",
        backgroundImage: `url("/img/network-background.png")`,
        backgroundPosition: "right top",
      },
      true
    )
  ),
};

export default LoginPage;
