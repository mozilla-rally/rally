import { UserDocument } from "@mozilla/rally-shared-types";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { LoginPageContent } from "../components/pages/login/LoginPageContent";
import { Strings } from "../resources/Strings";
import { useAuthentication } from "../services/AuthenticationService";
import { useStudies } from "../services/StudiesService";
import { useUserDocument } from "../services/UserDocumentService";
import { ApplyFullscapePageStyles } from "../styles";

const strings = Strings.pages.login;

const LoginPage: NextPage = () => {
  const { isLoaded, user } = useAuthentication();
  const router = useRouter();

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
    const redirectUrl = !installedStudyIds.length ? "/get-extension" : "/";
    saveEmailSubscriptionBeforeRedirecting(redirectUrl);
    return null;
  }

  return (
    <LoginPageContent>
      <Head>
        <title>{strings.title}</title>
      </Head>
    </LoginPageContent>
  );
};

ApplyFullscapePageStyles();

export default LoginPage;
