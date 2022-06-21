import { Col, Container, Row } from "reactstrap";
import { style } from "typestyle";

import { Strings } from "../../../resources/Strings";
import { Colors } from "../../../styles";
import { Fonts } from "../../../styles/Fonts";
import { Highlighter } from "../../Highlighter";
import { LoginButton } from "./LoginButton";
import { LoginState, useLoginDataContext } from "./LoginDataContext";
import { PrivacyNoticeAndLoginLink } from "./PrivacyNoticeAndLoginLink";

const strings = Strings.components.pages.login.initialLoginView;

export function InitialLoginView() {
  const { setLoginState } = useLoginDataContext();

  return (
    <Container className={`${styles.container} p-0`}>
      <Row className="mb-4">
        <Col className="d-flex justify-content-center">
          <Highlighter>
            <h1 className={Fonts.Headline}>{strings.title}</h1>
          </Highlighter>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <LoginButton
            icon="/img/icon-logo-google.svg"
            className="login-button"
            outline
          >
            {strings.signInWithGoogle}
          </LoginButton>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <LoginButton
            icon="/img/icon-email.svg"
            className="login-button"
            onClick={() => setLoginState(LoginState.SignupWithEmail)}
            outline
          >
            {strings.signInWithEmail}
          </LoginButton>
        </Col>
      </Row>
      <Row>
        <PrivacyNoticeAndLoginLink />
      </Row>
    </Container>
  );
}

const styles = {
  container: style({
    $nest: {
      ".login-button": {
        color: Colors.ColorMarketingGray70,
        borderColor: Colors.ColorMarketingGray30,
        $nest: {
          "&:hover": {
            backgroundColor: Colors.ColorMarketingGray20,
            color: Colors.ColorBlack,
          },
        },
      },
    },
  }),
};
