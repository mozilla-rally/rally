import { Col, Container, Row } from "reactstrap";
import { style } from "typestyle";

import { Strings } from "../../../../resources/Strings";
import { Colors } from "../../../../styles";
import { Spacing } from "../../../../styles";
import { CardStyles } from "../../../../styles/Cards";
import { FontSize, Fonts } from "../../../../styles/Fonts";

const strings = Strings.components.pages.home.pervasivePixels;

export function PervasivePixels() {
  return (
    <Container
      className={`d-block ${CardStyles.product.container} ${styles.container} `}
    >
      <Row className="d-flex">
        <Col className="col-12 col-lg-4 px-4">
          <h2 className={`${Fonts.Headline} mt-4 pervasive-pixels-title`}>{strings.title}</h2>
          <h4 className={`${FontSize.Large} pervasive-pixels-subtitle`}>{strings.subtitle}</h4>
          <div
            className={`${Fonts.MediumBodySM} ${FontSize.Small} pb-4`}
          >
            {strings.text}
          </div>
        </Col>
        <Col className="col-12 col-lg-8">
          <div
            className={`pervasive-pixels-datawrapper`}
          >
            <iframe title="Pervasive Pixels" aria-label="Scatter Plot" width="600" height="600" src={`${strings.datawrapperSource}`} />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

const styles = {
  container: style({
    padding: "16px 20px 20px",
    margin: `${Spacing.Large + 4}px 0px`,
    $nest: {
      ".pervasive-pixels-title": {
        color: Colors.ColorInk70,
        fontWeight: 700,
      },
      ".pervasive-pixels-subtitle": {
        color: Colors.ColorMarketingGray70,
      },
      ".pervasive-pixels-text": {
        lineHeight: `${Spacing.Large + 4}px`,
        color: "#333333",
      },
      ".pervasive-pixels-datawrapper": {
      },
    },
  }),
};
