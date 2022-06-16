import Head from "next/head";
import { Card, Col, Container, Row } from "reactstrap";
import { style } from "typestyle";

import { Strings } from "../../../resources/Strings";
import { ScreenSize, Spacing, createResponsiveStyle } from "../../../styles";
import { InitialLoginView } from "./InitialLoginView";
import {
  LoginState,
  LoginStateProvider,
  useLoginDataContext,
} from "./LoginDataContext";

const strings = Strings.components.pages.login.loginPageContainer;

export function LoginPageContainer() {
  return (
    <>
      <Head>
        <title>{strings.title}</title>
      </Head>
      <Container className={`${styles.container} p-5`}>
        <Row>
          <Col className="justify-content-center d-flex">
            <img className="logo pb-3" src="/img/logo-wide.svg" alt="" />
          </Col>
        </Row>
        <Row className="content-row mb-5">
          <Col className="justify-content-center d-flex p-2">
            <Card className="p-5">
              <LoginStateProvider>
                <LoginCardFactory />
              </LoginStateProvider>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-center">
            <a
              className="d-flex text-muted justify-content-center align-items-center"
              href="https://rally.mozilla.org/how-rally-works/"
              target="_blank"
              rel="noreferrer"
            >
              <span className="me-1">{strings.howDoesItWork}</span>
              <img src="img/icon-external-link.svg" alt="" />
            </a>
          </Col>
        </Row>
      </Container>
    </>
  );
}

function LoginCardFactory() {
  const { loginState } = useLoginDataContext();

  switch (loginState) {
    case LoginState.Initial:
      return <InitialLoginView />;

    default:
      throw new Error("Invalid card type.");
  }
}

const styles = {
  container: style(
    {
      minWidth: 300,
      height: "100vh",
      $nest: {
        "img.logo": {
          maxWidth: "100%",
          height: "auto",
        },
      },
    },
    createResponsiveStyle(ScreenSize.ExtraSmall, {
      minWidth: 365,
      paddingLeft: "0 !important",
      paddingRight: "0 !important",
      $nest: {
        ".content-row": {
          marginBottom: `${Spacing.xLarge}px !important`,
          $nest: {
            ".card": { border: "none", padding: "0 !important" },
          },
        },
      },
    })
  ),
};
