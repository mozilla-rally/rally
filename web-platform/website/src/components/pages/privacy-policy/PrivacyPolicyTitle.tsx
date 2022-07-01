import { Col, Row } from "reactstrap";

import { Strings } from "../../../resources/Strings";
import { Fonts } from "../../../styles/Fonts";

const strings = Strings.components.pages.privacyPolicy.title;

export function PrivacyPolicyTitle() {
  return (
    <>
      <Row>
        <Col>
          <h1 className={`${Fonts.Headline}`}>{strings.title}</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>{strings.tagline}</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <hr />
        </Col>
      </Row>
    </>
  );
}
