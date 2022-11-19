import { Button, Col, Container, Row } from "reactstrap";
import { style } from "typestyle";

import { Colors, ContainerStyles, Fonts, Spacing } from "../../../../styles";

export function NewsHeadline() {
  return (
    <Container className={`${ContainerStyles.NoSpacing} ${styles.container}`}>
      <Row>
        <Col className="text-center">ISSUES</Col>
      </Row>
      <Row>
        <Col className="text-center">
          <h4 className={`${Fonts.Headline} title text-center`}>
            Health and Bodily Autonomy
          </h4>
        </Col>
      </Row>
      <Row className="mb-2">
        <Col>
          <div
            style={{
              width: 350,
              height: 300,
              backgroundColor: "gray",
              margin: "auto",
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col className="ps-lg-5 pe-3 p-md-4 p-sm-3">
          <p>
            Issues of bodily autonomy in gender reproduction are becoming more
            and more fraught, with anti-trans legislation and the overturn of
            Roe v Wade. Medicine , traditional and startups are using the
            internet to provide care, including medication. One startup , Hey
            Jane has risen as a way to provide safe medication options for
            reproductive care. Unfortunately with the rise of telehealth, comes
            new ways for data surveillance.. W Most of the time, no one knows
            exactly what is being sent, including the platforms receiving the
            data. As part of the Markup’s work with PIxel Hunt, Hey Jane was
            found to be sending data to Meta, Google and others. As soon as they
            were made aware , they turned them off.
          </p>

          <p>
            The best part of Rally’s work is not fighting the platforms but
            providing safety and consent to users. Giving critical care
            providers and patients the ability to make informed choices not just
            about their medical health, but their data health as well.
          </p>

          <p className="mt-5">
            <Button outline={true} className="btn-outline-dark">
              Meta Pixel Hunt
            </Button>
          </p>
        </Col>
      </Row>
    </Container>
  );
}

const styles = {
  container: style({
    paddingTop: Spacing.xxLarge,
    paddingBottom: Spacing.xxLarge,
    backgroundColor: Colors.ColorViolet01,

    $nest: {
      ".title": {
        fontSize: `${38 / 16}rem`,
      },
    },
  }),
};
