import { Col, Container, Row } from "reactstrap";

import { Fonts } from "../../../styles/Fonts";

export interface StandardPrivacyPolicySectionProps {
  title: string;
  tagline: string;
  sections: {
    image?: { url: string; width: number; alt: string };
    text: string | JSX.Element;
  }[];
}

export function StandardPrivacyPolicySection({
  title,
  tagline,
  sections,
}: StandardPrivacyPolicySectionProps) {
  return (
    <>
      <Row>
        <Col>
          <h2 className={`${Fonts.Headline}`}>{title}</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>{tagline}</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <Container className="p-0 g-5">
            {sections.map(({ text }, i) => (
              <Row className={`d-flex align-items-center`} key={i}>
                <Col>{text}</Col>
              </Row>
            ))}
          </Container>
        </Col>
      </Row>
    </>
  );
}
