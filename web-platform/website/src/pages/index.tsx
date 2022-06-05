import type { NextPage } from "next";
import Head from "next/head";
import { AuthenticatedPage } from "../components/AuthenticatedPage";
import { Layout } from "../components/Layout";
import { Strings } from "../resources/Strings";

const strings = Strings.pages.index;

const Home: NextPage = () => {
  return (
    <AuthenticatedPage>
      <Head>
        <title>{strings.title}</title>
      </Head>

      <Layout>
        <div>Main page</div>
      </Layout>
    </AuthenticatedPage>
  );
};

export default Home;
