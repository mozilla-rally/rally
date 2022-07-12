import type { NextPage } from "next";
import Head from "next/head";

import { Layout } from "../components/Layout";
import { PrivacyPolicyPageContent } from "../components/pages/privacy-policy/PrivacyPolicyPageContent";
import { Strings } from "../resources/Strings";

const strings = Strings.pages.privacyPolicy;

const Home: NextPage = () => {
  return (
    <Layout>
      <>
        <Head>
          <title>{strings.title}</title>
        </Head>

        <PrivacyPolicyPageContent readOnly={true} />
      </>
    </Layout>
  );
};

export default Home;
