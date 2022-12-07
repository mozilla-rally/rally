import { HTMLAttributes } from "react";
import { Col, Container, Row } from "reactstrap";

import { Strings } from "../../../resources/Strings";
import { Fonts } from "../../../styles/Fonts";

const strings = Strings.components.pages.home.title;

export function HomePageTitle({
  children, // eslint-disable-line @typescript-eslint/no-unused-vars
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <Container className={`p-0 ${className || ""}`} {...rest}>
      <Row>
        <Col>
          <h1 className={`${Fonts.Headline} mt-5 mb-2 text-center`}>
            {strings.title}
          </h1>
        </Col>
      </Row>
    </Container>
  );
}
