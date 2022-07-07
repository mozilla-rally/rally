import { HTMLAttributes } from "react";
import { Button, Col, Container, Row } from "reactstrap";
import { style } from "typestyle";

import { Strings } from "../../../resources/Strings";
import { Colors, Spacing } from "../../../styles";
import { Fonts } from "../../../styles/Fonts";

export interface StandardProfileSectionProps
  extends HTMLAttributes<HTMLDivElement> {
  title: string;
  isValuePresent: boolean;
  onDataCleared: () => void;
  enableTwoColumnLayout: boolean;
}

export function StandardProfileSection({
  isValuePresent,
  children,
  onDataCleared,
  title,
  enableTwoColumnLayout,
  ...rest
}: StandardProfileSectionProps) {
  const items = Array.isArray(children) ? children : children ? [children] : [];

  return (
    <Container {...rest}>
      <Row className="d-flex align-items-center mb-2">
        <Col className="col-auto">
          <span className={`${Fonts.Headline} text-body`}>{title}</span>
        </Col>
        <Col>
          <Button
            onClick={() => onDataCleared()}
            className={`${styles.closeButton} ${
              isValuePresent ? "" : "invisible"
            } text-nowrap`}
          >
            <img
              src="/img/close.svg"
              width={16}
              height={16}
              className="me-1"
              alt={
                Strings.components.pages.profile.standardProfileSection
                  .clearResponse
              }
            />
            {
              Strings.components.pages.profile.standardProfileSection
                .clearResponse
            }
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Container>
            <Row>
              {items.map((item, i) => (
                <Col
                  className={`col-12 ${
                    enableTwoColumnLayout ? "col-md-6" : ""
                  } d-flex align-items-center mb-3`}
                  key={i}
                >
                  {item}
                </Col>
              ))}
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}

const styles = {
  closeButton: style({
    paddingLeft: Spacing.Small,
    paddingRight: Spacing.Small,
    paddingTop: Spacing.Micro,
    paddingBottom: Spacing.Micro,
    background: Colors.ColorLightGray30,
    borderColor: Colors.ColorLightGray30,
    color: Colors.ColorBlack,
    borderRadius: 2,
    fontWeight: 600,
    "-webkit-font-smoothing": "antialiased",
    $nest: {
      "&:hover": {
        backgroundColor: Colors.ColorLightGray50,
        borderColor: Colors.ColorLightGray50,
        color: Colors.ColorBlack,
      },
    },
  }),
};
