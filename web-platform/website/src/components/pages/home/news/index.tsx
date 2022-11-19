import { Col, Container, Row } from "reactstrap";
import { style } from "typestyle";

import { Strings } from "../../../../resources/Strings";
import {
  Colors,
  ContainerStyles,
  FontSize,
  Fonts,
  Spacing,
} from "../../../../styles";
import { NewsHeadline } from "./NewsHeadline";
import { NewsItem } from "./NewsItem";

const strings = Strings.components.pages.home.news;

export function News() {
  return (
    <Container className={`${ContainerStyles.NoSpacing}`}>
      <Row className={styles.divider}>
        <Col className={`${Fonts.Headline} ${FontSize.xxLarge}`}>
          Our impact across the web
        </Col>
      </Row>
      <Row>
        <Col className="col-12 col-lg-6">
          <NewsHeadline />
        </Col>
        <Col className="col-12 col-lg-6 bg-white ps-lg-3 pe-lg-3 ps-md-5 pe-md-5 ps-sm-3 pe-sm-3">
          {strings.items.map((item) => (
            <NewsItem {...item} />
          ))}
        </Col>
      </Row>
    </Container>
  );
}

const styles = {
  divider: style({
    paddingTop: Spacing.xxxLarge * 2.5,
    paddingBottom: Spacing.xxLarge,
    paddingLeft: Spacing.xxLarge * 2,
    backgroundColor: Colors.ColorLightGray10,
  }),
};
