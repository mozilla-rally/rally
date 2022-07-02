import { Card, Col, Container, Row } from "reactstrap";
import { style } from "typestyle";

import { ScreenSize, Spacing, createResponsiveStyle } from "../../../styles";
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

export function LoginPageContent() {
  return (
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
