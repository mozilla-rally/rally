import { Col, Container, Row } from "reactstrap";

import { Strings } from "../../../resources/Strings";
import { PrimaryButton } from "../../../styles/Buttons";
import { FontSize, Fonts } from "../../../styles/Fonts";
import { Highlighter } from "../../Highlighter";
import { LoginButton } from "./LoginButton";
import { LoginState, useLoginDataContext } from "./LoginDataContext";

const strings = Strings.components.pages.login.emailAccountCreatedView;

export function EmailAccountCreatedView() {
  const { setLoginState } = useLoginDataContext();

  return (
    <Container className={`p-0`}>
      <Row className="mb-4">
        <Col className="d-flex justify-content-center">
          <Highlighter>
            <h1 className={Fonts.Headline}>{strings.title}</h1>
          </Highlighter>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col className="d-flex justify-content-center">
          <span className="text-center">{strings.message}</span>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <LoginButton
            className={PrimaryButton}
            onClick={() => setLoginState(LoginState.Login)}
          >
            {strings.backToSignIn}
          </LoginButton>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex justify-content-center">
          <span className={FontSize.Small}>{strings.needHelp}</span>
        </Col>
      </Row>
    </Container>
  );
}
