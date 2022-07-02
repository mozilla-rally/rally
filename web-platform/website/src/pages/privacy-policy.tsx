import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { cssRule } from "typestyle";

import { AuthenticatedPage } from "../components/AuthenticatedPage";
import { PrivacyPolicyPageContent } from "../components/pages/privacy-policy/PrivacyPolicyPageContent";
import { Strings } from "../resources/Strings";
import { useUserDocument } from "../services/UserDocumentService";

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

      <PrivacyPolicyPageContent />
    </AuthenticatedPage>
  );
};

cssRule("body", {
  background: `url("/img/noise-texture-top.png"), url("/img/noise-texture.png")`,
  backgroundBlendMode: "screen",
});

export default PrivacyPolicyPage;
