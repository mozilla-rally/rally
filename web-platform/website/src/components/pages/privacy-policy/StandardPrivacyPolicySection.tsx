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
  const isExtensionView = localStorage.getItem("isExtensionView");

  return (
    <>
      <Row>
        <Col>
          <h2 className={`${Fonts.Headline}`}>{title}</h2>
        </Col>
      </Row>
      <Row className={`${!isExtensionView ? "mb-4" : ""}`}>
        <Col>
          <p>{tagline}</p>
        </Col>
      </Row>
      <Row className={`${!isExtensionView ? "mb-4" : ""}`}>
        <Col>
          <Container className="p-0 g-5">
            {sections.map(({ image, text }, i) => (
              <Row
                className={`d-flex align-items-center ${
                  !isExtensionView ? "mb-4" : ""
                }`}
                key={i}
              >
                {!isExtensionView && image && (
                  <Col className="col-12 col-sm-2 mb-4 text-center">
                    <img
                      width={image.width}
                      src={image.url}
                      alt={image.alt}
                    ></img>
                  </Col>
                )}
                <Col>{text}</Col>
              </Row>
            ))}
          </Container>
        </Col>
      </Row>
    </>
  );
}
