import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { Col, Row } from "reactstrap";

import { Layout } from "../components/Layout";
import { FeatureColumn } from "../components/pages/login/FeatureColumn";
import { LoginPageContent } from "../components/pages/login/LoginPageContent";
import { Strings } from "../resources/Strings";
import { useAuthentication } from "../services/AuthenticationService";
import { ApplyFullscapePageStyles } from "../styles";

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
      <Row>
        <Col className="col-9">
          <Head>
            <title>{strings.title}</title>
          </Head>
          <div>
            <LoginPageContent />
          </div>
        </Col>
        <Col className="col-3">
          <FeatureColumn />
        </Col>
      </Row>
    </Layout>
  );
};

ApplyFullscapePageStyles();

export default LoginPage;
