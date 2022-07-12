import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Col,
  Container,
  Row,
} from "reactstrap";

import { Strings } from "../../../../resources/Strings";
import { StandardAccordion } from "../../../../styles/Accordions";
import { FontSize } from "../../../../styles/Fonts";
import { useStudy } from "./StudyDataContext";
import { StudyTag } from "./StudyTag";

const strings = Strings.components.pages.studies.studyCard.description;

export function StudyDescription() {
  const { study, isUserEnrolled } = useStudy();
  const [isExpanded, setIsExpanded] = useState(!isUserEnrolled);

  useEffect(() => {
    setIsExpanded(!isUserEnrolled);
  }, [isUserEnrolled]);

  return (
    <Accordion // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      open={isExpanded ? study.studyId : ""} //@ts-ignore Ref: https://github.com/reactstrap/reactstrap/issues/2165
      toggle={() => setIsExpanded((s) => !s)}
      className={`${StandardAccordion}`}
    >
      <AccordionItem>
        <AccordionHeader targetId={study.studyId}>
          {strings.aboutThisStudy}
        </AccordionHeader>
        <AccordionBody accordionId={study.studyId}>
          <Container className="p-0">
            <Row>
              <Col className="mt-3 mb-3">{study.description}</Col>
            </Row>
            <Row>
              <Col className={`${FontSize.Normal} fw-bold text-body`}>
                {strings.keyDataCollected}
              </Col>
            </Row>
            <Row>
              <Col>
                <ul>
                  {study.dataCollectionDetails.map((d, i) => (
                    <li className="mt-1" key={i}>
                      {d}
                    </li>
                  ))}
                </ul>
              </Col>
            </Row>
            <Row>
              <Col>
                <hr className="mt-0 mb-3" />
              </Col>
            </Row>
            <Row className="d-flex flex-row-reverse align-items-center">
              <Col className="d-flex justify-content-sm-left justify-content-md-end col-sm-12 col-md-auto flex-grow-1">
                <a
                  className={`${FontSize.Small} p-1`}
                  href={study.studyDetailsLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  {strings.viewFullStudyDetails}{" "}
                  <img
                    src="/img/open-external.svg"
                    className="ms-1 mb-2"
                    alt=""
                  />
                </a>
              </Col>
              {study.tags.reverse().map((tag, i) => (
                <Col
                  className={`col-auto text-uppercase fw-bold ${
                    FontSize.xSmall
                  } text-body ${i === 0 ? "flex-sm-grow-1" : ""}`}
                  key={i}
                >
                  <StudyTag>{tag}</StudyTag>
                </Col>
              ))}
            </Row>
          </Container>
        </AccordionBody>
      </AccordionItem>
    </Accordion>
  );
}
