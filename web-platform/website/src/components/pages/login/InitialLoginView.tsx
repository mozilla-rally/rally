import { Col, Container, Row } from "reactstrap";
import { style } from "typestyle";

import { Strings } from "../../../resources/Strings";
import { useAuthentication } from "../../../services/AuthenticationService";
import { Spacing } from "../../../styles";
import { Colors } from "../../../styles";
import { TertiaryButton } from "../../../styles/Buttons";
import { FontSize, Fonts } from "../../../styles/Fonts";
import { Highlighter } from "../../Highlighter";
import { LoginButton } from "./LoginButton";
import { LoginState, useLoginDataContext } from "./LoginDataContext";
import { PrivacyNoticeAndLoginLink } from "./PrivacyNoticeAndLoginLink";

const strings = Strings.components.pages.login.initialLoginView;

export function InitialLoginView() {
  const { setLoginState } = useLoginDataContext();
  const { loginWithGoogle } = useAuthentication();

  return (
    <Container className={`p-0`}>
      <Row className="mb-3">
        <Col className="d-flex">
          <Highlighter className="highlight-launch">
            <h1 className={`${Fonts.Headline} ${styles.title}`}>
              {strings.launch.extensionTrue.title}
            </h1>
          </Highlighter>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <h5
            className={`${FontSize.Large} ${Fonts.MediumBodySM} ${styles.subTitle}`}
          >
            {strings.launch.extensionTrue.subTitle}
          </h5>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <LoginButton
            icon="/img/icon-logo-google.svg"
            className={TertiaryButton}
            onClick={() => loginWithGoogle()}
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
            className={TertiaryButton}
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
  title: style({
    width: "calc(472px * .7)",
    textAlign: "left",
    lineHeight: `${Spacing.xxxLarge}px`,
  }),
  subTitle: style({
    lineHeight: `${Spacing.xLarge + 4}px`,
    color: Colors.ColorMarketingGray70,
  }),
};
