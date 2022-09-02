import { Card, Col, Container, Row } from "reactstrap";
import { style } from "typestyle";

import { ScreenSize, Spacing, createResponsiveStyle } from "../../../styles";
import { EmailAccountCreatedView } from "./EmailAccountCreatedView";
import { EmailSignupView } from "./EmailSignupView";
import { InitialLoginView } from "./InitialLoginView";
import { Strings } from "../../../resources/Strings"
import {
  LoginState,
  LoginStateProvider,
  useLoginDataContext,
} from "./LoginDataContext";
import { LoginView } from "./LoginView";
import { ResetPasswordView } from "./ResetPasswordView";
import { FontSizeRaw } from "../../../styles/Fonts";

const strings = Strings.components.pages.login.launchCardText

export function LoginPageContent() {
  return (
    <Container className={`${styles.container} p-5 mt-5`}>
      <Row className="content-row mb-5 d-flex">
        <RenderLaunchText />
        <Col className="login-col justify-content-center d-flex p-2">
          <Card className="login-card flex-nowrap">
            <LoginStateProvider>
              <LoginCardFactory />
            </LoginStateProvider>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

function RenderLaunchText() {
  return (
    <Col className={`${styles.launchTextStyle} p-2 justify-content-center`}>
      <Card className="launch-card flex-nowrap p-5">
        <h5 className="launch-header">{strings.headline}</h5>
        <ul className="bullets">
          {strings.bullets.map((item) => {
            return (
              <li className="bullets-item">{item}</li>
            )
          })}
        </ul>
      </Card>
    </Col>
  )
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
      $nest: {
        "img.logo": {
          maxWidth: "100%",
          height: "auto",
        },
        ".login-col": {
          marginRight: "3rem"
        },
        ".login-card": {
          minWidth: 450,
          padding: "3rem"
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
              minWidth: 300
            },
          },
        },
        ".login-col": {
          marginRight: 0,
        }
      },
    })
  ),
  launchTextStyle: style(
    {
      display: "none",
      border: "none",
      $nest: {
        ".launch-card": {
          border: "none",
          backgroundColor: "transparent"
        },
        ".launch-header": {
          marginBottom: Spacing.xLarge,
          fontWeight: "bold",
          fontSize: `${FontSizeRaw.xxLarge.fontSize} !important`
        },
        ".bullets": {
          listStyle: "none",
          padding: 0,

          $nest: {
            ".bullets-item": {
              background: "no-repeat",
              backgroundImage: `url("/img/checkmark-static.png")`,
              lineHeight: "35px",
              paddingLeft: Spacing.xxxLarge,
              verticalAlign: "middle",
              fontSize: FontSizeRaw.Large.fontSize,
              color: "#20123a",
              paddingBottom: "20px",
            }
          }
        }
      },
    },
    createResponsiveStyle(ScreenSize.Medium, {
      display: "flex"
    }, true),
  )
};
