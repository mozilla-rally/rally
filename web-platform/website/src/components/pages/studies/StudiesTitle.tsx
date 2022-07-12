import { HTMLAttributes } from "react";
import { Col, Container, Row } from "reactstrap";

import { Strings } from "../../../resources/Strings";
import { Fonts } from "../../../styles/Fonts";

const strings = Strings.components.pages.studies.title;

export function StudiesTitle({
  children, // eslint-disable-line @typescript-eslint/no-unused-vars
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <Container className={`p-0 ${className || ""}`} {...rest}>
      <Row>
        <Col>
          <h1 className={`${Fonts.Headline} mb-2`}>{strings.title}</h1>
        </Col>
      </Row>
      <Row>
        <Col>{strings.tagline}</Col>
      </Row>
    </Container>
  );
}
