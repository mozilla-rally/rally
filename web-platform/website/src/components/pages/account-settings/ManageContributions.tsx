import { Col, Container, Row } from "reactstrap";

import { Strings } from "../../../resources/Strings";
import { Fonts } from "../../../styles";
import { StudyList } from "../home/StudyList";

const strings = Strings.components.pages.accountSettings.manageContributions;

export function ManageContributions() {
  return (
    <Container className="p-0">
      <Row>
        <Col>
          <h1 className={Fonts.Headline}>{strings.title}</h1>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <p>{strings.tagline}</p>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <StudyList />
        </Col>
      </Row>
    </Container>
  );
}
