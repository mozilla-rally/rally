import type { NextPage } from "next";
import Head from "next/head";

import { AuthenticatedPage } from "../components/AuthenticatedPage";
import { PrivacyPolicyPageContainer } from "../components/pages/privacy-policy/PrivacyPolicyPageContainer";
import { Strings } from "../resources/Strings";

const strings = Strings.pages.privacyPolicy;

const PrivacyPolicyPage: NextPage = () => {
  return (
    <AuthenticatedPage>
      <Head>
        <title>{strings.title}</title>
      </Head>

      <PrivacyPolicyPageContainer />
    </AuthenticatedPage>
  );
};

export default PrivacyPolicyPage;
