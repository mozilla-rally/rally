import { Col, Container, Row } from "reactstrap";

import { Strings } from "../../../../resources/Strings";
import { useStudy } from "./StudyDataContext";

const strings = Strings.components.pages.studies.studyCard.title;

export function StudyTitle() {
  const { study } = useStudy();
  const tagline = strings.taglineFormat
    .replace("{publisher}", study.authors.name)
    .replace("{expiry}", parseStudyExpiryDate(study.endDate));

  return (
    <Container className="p-0">
      <Row>
        <Col className="col-auto ps-0 me-4">
          <img
            src={
              (study.icons && study.icons[64]) || "img/default-study-icon.png"
            }
            style={{ minWidth: 60, width: 60 }}
            alt=""
          />
        </Col>
        <Col className="me-4 g-0">
          <Container className="p-0">
            <Row>
              <Col>
                <span className={`study-name text-body fw-bold`}>
                  {study.name}
                </span>
              </Col>
            </Row>
            <Row>
              <Col>{tagline}</Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}

const expiryDateRegExp = /(\d+)-(\d+)-(\d+)+/;

function parseStudyExpiryDate(dateStr: string | "Ongoing") {
  const parseResult = dateStr.match(expiryDateRegExp);

  if (!parseResult || parseResult.length < 4) {
    return dateStr;
  }

  return strings.ends.replace(
    "{expiry}",
    new Date(
      parseInt(parseResult[1], 10),
      parseInt(parseResult[2], 10) - 1,
      parseInt(parseResult[3], 10)
    ).toDateString()
  );
}
