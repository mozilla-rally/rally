import type { NextPage } from "next";
import Head from "next/head";

import { AuthenticatedPage } from "../components/AuthenticatedPage";
import { StudiesPageContent } from "../components/pages/studies/StudiesPageContent";
import { Strings } from "../resources/Strings";

const strings = Strings.pages.index;

const Home: NextPage = () => {
  return (
    <AuthenticatedPage>
      <Head>
        <title>{strings.title}</title>
      </Head>

      <StudiesPageContent />
    </AuthenticatedPage>
  );
};

export default Home;
