import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { Layout } from "../components/Layout";
import { LoginPageContainer } from "../components/pages/login/LoginPageContainer";
import { Strings } from "../resources/Strings";
import { useAuthentication } from "../services/AuthenticationService";

const strings = Strings.pages.login;

const LoginPage: NextPage = () => {
  const { isLoaded, isUserVerified } = useAuthentication();

  const router = useRouter();

  if (!isLoaded || !router.isReady) {
    return null;
  }

  if (isUserVerified) {
    router.replace("/");
    return null;
  }

  return (
    <Layout>
      <>
        <Head>
          <title>{strings.title}</title>
        </Head>
        <LoginPageContainer />
      </>
    </Layout>
  );
};

export default LoginPage;
