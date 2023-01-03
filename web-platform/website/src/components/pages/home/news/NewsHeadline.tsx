import { Button, Col, Container, Row } from "reactstrap";
import { style } from "typestyle";

import { Strings } from "../../../../resources/Strings";
import { Colors, ContainerStyles, Fonts, Spacing } from "../../../../styles";

const strings = Strings.components.pages.home.news.headline;

export function NewsHeadline() {
  return (
    <Container className={`${ContainerStyles.NoSpacing} ${styles.container}`}>
      <Row>
        <Col className="text-center">{strings.tagline}</Col>
      </Row>
      <Row>
        <Col className="text-center">
          <h4 className={`${Fonts.Headline} title text-center`}>
            {strings.title}
          </h4>
        </Col>
      </Row>
      <Row className="mb-2">
        <Col className="d-flex justify-content-center">
          <img
            src={strings.image.url}
            style={{
              maxWidth: 350,
              maxHeight: 300,
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col className="ps-lg-5 pe-3 p-md-4 p-sm-3">
          {strings.content}

          <p className="mt-5">
            <Button outline={true} className="btn-outline-dark">
              {strings.link.text}
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
