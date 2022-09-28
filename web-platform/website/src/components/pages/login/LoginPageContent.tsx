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
    <Container className={`${styles.container} p-5 mt-5`}>
      <Row className="content-row mb-5 d-flex position-relative">
        <LoginStateProvider>
          <Col className="login-col justify-content-center d-flex p-2">
            <Card className="login-card flex-nowrap">
              <LoginCardFactory />
            </Card>
          </Col>
        </LoginStateProvider>
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
      flexGrow: 1,
      height: "100vh",
      $nest: {
        "img.logo": {
          maxWidth: "100%",
          height: "auto",
        },
        ".login-col": {
          marginRight: 1.2 * Spacing.xxxLarge,
        },
        ".login-card": {
          maxWidth: "472px",
          width: "100%",
          border: "none",
        },
      },
    },
    createResponsiveStyle(ScreenSize.ExtraSmall, {
      minWidth: "unset",
      maxWidth: "300px",
      paddingLeft: "0 !important",
      paddingRight: "0 !important",
      $nest: {
        ".content-row": {
          marginBottom: `${Spacing.xLarge}px !important`,
          $nest: {
            ".login-card": {
              border: "none",
              padding: "1rem",
              minWidth: 300,
            },
          },
        },
        ".login-col": {
          marginRight: 0,
        },
      },
    })
  ),
};
