import { Col, Container, Row } from "reactstrap";

import { Flags } from "../../../resources/Flags";
import { Strings } from "../../../resources/Strings";
import { useAuthentication } from "../../../services/AuthenticationService";
import { useFlagService } from "../../../services/FlagService";
import { TertiaryButton } from "../../../styles/Buttons";
import { Fonts } from "../../../styles/Fonts";
import { Highlighter } from "../../Highlighter";
import { LoginButton } from "./LoginButton";
import { LoginState, useLoginDataContext } from "./LoginDataContext";
import { PrivacyNoticeAndLoginLink } from "./PrivacyNoticeAndLoginLink";

const strings = Strings.components.pages.login.initialLoginView;

export function InitialLoginView() {
  const { setLoginState } = useLoginDataContext();
  const { loginWithGoogle } = useAuthentication();
  const { isFlagActive } = useFlagService();

  const isV2Enabled = isFlagActive(Flags.onboardingV2);

  return (
    <Container className={`p-0`}>
      {!isV2Enabled && (
        <Row className="mb-4">
          <Col className={`d-flex justify-content-center`}>
            <Highlighter>
              <h1 className={Fonts.Headline}>{strings.title}</h1>
            </Highlighter>
          </Col>
        </Row>
      )}
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
