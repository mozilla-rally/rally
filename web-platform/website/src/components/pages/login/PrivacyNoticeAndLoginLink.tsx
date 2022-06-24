import { Col, Container, Row } from "reactstrap";
import { style } from "typestyle";

import { Strings } from "../../../resources/Strings";
import { createResponsiveStyle } from "../../../styles/ResponsiveStyle";
import { ScreenSize } from "../../../styles/ScreenSize";
import { Spacing } from "../../../styles/Spacing";

const strings = Strings.components.pages.login.privacyNoticeAndLoginLink;

export function PrivacyNoticeAndLoginLink() {
  return (
    <Container className={`${styles.container} p-0`}>
      <Row className="privacy-notice mb-5">
        <Col className="d-flex justify-content-center">
          {strings.privacyNotice}
        </Col>
      </Row>
      <Row className="justify-content-center gx-0 gy-0">
        <Col className="d-flex justify-content-center col-auto me-1">
          {strings.accountExists}
        </Col>
        <Col className="col-auto">
          <a href="#" className="fw-bold">
            {strings.signIn}
          </a>
        </Col>
      </Row>
    </Container>
  );
}

const styles = {
  container: style({
    $nest: {
      ".privacy-notice": createResponsiveStyle(ScreenSize.ExtraSmall, {
        marginBottom: `${Spacing.xLarge}px !important`,
      }),
    },
  }),
};
