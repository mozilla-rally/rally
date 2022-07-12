import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { AuthenticatedPage } from "../components/AuthenticatedPage";
import { PrivacyPolicyPageContent } from "../components/pages/privacy-policy/PrivacyPolicyPageContent";
import { Strings } from "../resources/Strings";
import { useUserDocument } from "../services/UserDocumentService";
import { ApplyFullscapePageStyles } from "../styles";

const strings = Strings.pages.privacyPolicy;

const PrivacyPolicyPage: NextPage = () => {
  const { userDocument } = useUserDocument();
  const router = useRouter();

  if (!router.isReady) {
    return null;
  }

  if (userDocument && userDocument.enrolled) {
    router.replace("/");
    return null;
  }

  return (
    <AuthenticatedPage>
      <Head>
        <title>{strings.title}</title>
      </Head>

      <PrivacyPolicyPageContent readOnly={false} />
    </AuthenticatedPage>
  );
};

ApplyFullscapePageStyles();

export default PrivacyPolicyPage;
