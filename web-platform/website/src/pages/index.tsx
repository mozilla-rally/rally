import type { NextPage } from "next";
import Head from "next/head";

import { AuthenticatedPage } from "../components/AuthenticatedPage";
import { HomePageContent } from "../components/pages/home/HomePageContent";
import { Strings } from "../resources/Strings";

const strings = Strings.pages.index;

const Home: NextPage = () => {
  return (
    <AuthenticatedPage>
      <Head>
        <title>{strings.title}</title>
      </Head>

      <HomePageContent />
    </AuthenticatedPage>
  );
};

export default Home;
