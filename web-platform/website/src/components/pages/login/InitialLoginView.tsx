import { Col, Container, Row } from "reactstrap";

import { Strings } from "../../../resources/Strings";
import { useAuthentication } from "../../../services/AuthenticationService";
import { TertiaryButton } from "../../../styles/Buttons";
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
