import Head from "next/head";
import { Card, Col, Container, Row } from "reactstrap";
import { cssRule, style } from "typestyle";

import { Strings } from "../../../resources/Strings";
import { useAuthentication } from "../../../services/AuthenticationService";
import { ScreenSize, Spacing, createResponsiveStyle } from "../../../styles";
import { Layout } from "../../Layout";
import { EmailAccountCreatedView } from "./EmailAccountCreatedView";
import { EmailSignupView } from "./EmailSignupView";
import { InitialLoginView } from "./InitialLoginView";
import {
  LoginState,
  LoginStateProvider,
  useLoginDataContext,
} from "./LoginDataContext";
import { LoginView } from "./LoginView";
import { ResetPasswordView } from "./ResetPasswordView";

const strings = Strings.components.pages.login.loginPageContainer;

export function LoginPageContainer() {
  const { isUserVerified } = useAuthentication();

  if (isUserVerified) {
    document.location = "/";
  }

  return (
    <Layout>
      <>
        <Head>
          <title>{strings.title}</title>
        </Head>
        <Container className={`${styles.container} p-5`}>
          <Row className="content-row mb-5">
            <Col className="justify-content-center d-flex p-2">
              <Card className="login-card flex-nowrap p-5">
                <LoginStateProvider>
                  <LoginCardFactory />
                </LoginStateProvider>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    </Layout>
  );
}

function LoginCardFactory() {
  const { loginState } = useLoginDataContext();

  switch (loginState) {
    case LoginState.Initial:
      return <InitialLoginView />;

    case LoginState.EmailAccountCreated:
      return <EmailAccountCreatedView />;

    case LoginState.Login:
      return <LoginView />;

    case LoginState.ResetPassword:
      return <ResetPasswordView />;

    case LoginState.SignupWithEmail:
      return <EmailSignupView />;

    default:
      throw new Error("Invalid card type.");
  }
}

cssRule("body", {
  background: `url("/img/noise-texture-top.png"), url("/img/noise-texture.png")`,
  backgroundBlendMode: "screen",
});

const styles = {
  container: style(
    {
      $nest: {
        "img.logo": {
          maxWidth: "100%",
          height: "auto",
        },
        ".login-card": {
          width: 450,
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
            ".login-card": {
              border: "none",
              padding: "0 !important",
              minWidth: 400,
            },
          },
        },
      },
    })
  ),
};
