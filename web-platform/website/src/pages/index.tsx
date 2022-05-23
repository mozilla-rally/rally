import type { NextPage } from "next";
import Head from "next/head";
import { AuthenticatedPage } from "../components/AuthenticatedPage";
import { Strings } from "../resources/Strings";

const strings = Strings.pages.index;

const Home: NextPage = () => {
  return (
    <AuthenticatedPage>
      <Head>
        <title>{strings.title}</title>
      </Head>

      <main>Main Page</main>
    </AuthenticatedPage>
  );
};

export default Home;
