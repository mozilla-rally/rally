import type { NextPage } from "next";
import Head from "next/head";

import { AuthenticatedPage } from "../components/AuthenticatedPage";
import { StudiesPageContent } from "../components/pages/studies/StudiesPageContent";
import { StudiesPageContentV2 } from "../components/pages/studies/StudiesPageContentV2";
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
        <StudiesPageContentV2 />
      ) : (
        <StudiesPageContent />
      )}
    </AuthenticatedPage>
  );
};

export default Home;
