import type { NextPage } from "next";
import Head from "next/head";

import { AuthenticatedPage } from "../components/AuthenticatedPage";
import { HomePageContent } from "../components/pages/home/HomePageContent";
import { HomePageContentV2 } from "../components/pages/home/HomePageContentV2";
import { Flags } from "../resources/Flags";
import { Strings } from "../resources/Strings";
import { useFlagService } from "../services/FlagService";

const strings = Strings.pages.index;

const Home: NextPage = () => {
  const { isFlagActive } = useFlagService();
  return (
    <AuthenticatedPage>
      <Head>
        <title>{strings.title}</title>
      </Head>

      {isFlagActive(Flags.HomepageV2) ? (
        <HomePageContentV2 />
      ) : (
        <HomePageContent />
      )}
    </AuthenticatedPage>
  );
};

export default Home;
