import { Col, Container, Row } from "reactstrap";
import { style } from "typestyle";

import { Strings } from "../../../resources/Strings";
import { PrimaryButton } from "../../../styles/Buttons";
import { Fonts } from "../../../styles/Fonts";
import { FontSize } from "../../../styles/Fonts";
import { Highlighter } from "../../Highlighter";
import { LoginButton } from "./LoginButton";

const strings = Strings.components.pages.login.emailAccountCreatedView;

export function EmailAccountCreatedView() {
  return (
    <Container className={`${styles.container} p-0`}>
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
          <LoginButton className={PrimaryButton}>
            {strings.backToSignIn}
          </LoginButton>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex justify-content-center">
          <span className="help">{strings.needHelp}</span>
        </Col>
      </Row>
    </Container>
  );
}

const styles = {
  container: style({
    $nest: {
      ".help": {
        fontSize: FontSize.Small,
      },
    },
  }),
};
