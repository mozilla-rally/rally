import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { style } from "typestyle";

import { Layout } from "../components/Layout";
import { LoginPageContent } from "../components/pages/login/LoginPageContent";
import { Strings } from "../resources/Strings";
import { useAuthentication } from "../services/AuthenticationService";
import {
  ApplyFullscapePageStyles,
  ScreenSize,
  createResponsiveStyle,
} from "../styles";

const strings = Strings.pages.login;

const LoginPage: NextPage = () => {
  const { isLoaded, user } = useAuthentication();

  const router = useRouter();

  if (!isLoaded || !router.isReady) {
    return null;
  }

  if (user) {
    router.replace("/");
    return null;
  }

  return (
    <Layout>
      <>
        <Head>
          <title>{strings.title}</title>
        </Head>
        <div className={styles.signBackground}>
          <LoginPageContent />
        </div>
      </>
    </Layout>
  );
};

ApplyFullscapePageStyles();

const styles = {
  signBackground: style(
    {
      backgroundImage: "none",
    },
    createResponsiveStyle(
      ScreenSize.Medium,
      {
        width: "100%",
        height: "100vh",
        background: "no-repeat",
        backgroundImage: `url("/img/network-background.png")`,
        backgroundPosition: "right top",
      },
      true
    )
  ),
};

export default LoginPage;
